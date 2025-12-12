import crypto from "crypto";
import Imap from "imap";
import nodemailer from "nodemailer";
import { simpleParser } from "mailparser";

const algorithm = "aes-256-gcm";
const ivLength = 16;

// Replace this with a key from your secure vault or environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes for AES-256

export const generatCode = (letter, number) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array(letter)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("");

  const randomDigits = Math.floor(Math.random() * 100)
    .toString()
    .padStart(number, "0");

  return randomLetters + randomDigits;
};

export function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedData) {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}


export async function fetchMails(imapConfig) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      ...imapConfig,
      tlsOptions: { rejectUnauthorized: false }, // Remove in production
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      requireTLS: true,
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
      logger: false,
      debug: false
    });

    let folders = ["INBOX"];
    const allMails = [];
    let pendingParses = 0;
    let foldersProcessed = 0;
    let currentFolder = null;

    function openBox(folder, cb) {
      imap.openBox(folder, true, cb);
    }

    function processFolder(folder) {
      currentFolder = folder;
      openBox(folder, (err, box) => {
        if (err) {
          console.warn(`Error opening ${folder}: ${err.message}`);
          foldersProcessed++;
          if (foldersProcessed < folders.length) {
            processFolder(folders[foldersProcessed]);
          } else {
            checkCompletion();
          }
          return;
        }
        console.log(`${folder} opened, total messages: ${box.messages.total}`);

        if (box.messages.total === 0) {
          console.log(`${folder} is empty, skipping fetch`);
          foldersProcessed++;
          if (foldersProcessed < folders.length) {
            processFolder(folders[foldersProcessed]);
          } else {
            checkCompletion();
          }
          return;
        }

        const fetchRange = `1:${box.messages.total}`;

        const f = imap.seq.fetch(fetchRange, {
          bodies: "",
          struct: true,
        });

        f.on("message", (msg, seqno) => {
          console.log(`Processing message ${seqno} in ${folder}`);
          let buffer = "";

          msg.on("body", (stream) => {
            stream.on("data", (chunk) => {
              buffer += chunk.toString("utf8");
            });
          });

          msg.once("end", async () => {
            pendingParses++;
            try {
              const parsed = await simpleParser(buffer);
              console.log(parsed);
              allMails.push({
                id: `${folder}-${seqno}`,
                messageId: parsed.messageId,
                subject: parsed.subject || "No Subject",
                name: parsed.from.value[0].name,
                from: parsed.from.value[0].address,
                date: parsed.date || new Date(),
                text: parsed.text || "",
                folder: folder,
              });
              console.log(`Message ${seqno} in ${folder} parsed successfully`);
            } catch (err) {
              console.error(`Error parsing mail ${seqno} in ${folder}:`, err);
            } finally {
              pendingParses--;
              checkCompletion();
            }
          });
        });

        f.once("error", (err) => {
          console.error(`Fetch error in ${folder}:`, err);
          foldersProcessed++;
          if (foldersProcessed < folders.length) {
            processFolder(folders[foldersProcessed]);
          } else {
            checkCompletion();
          }
        });

        f.once("end", () => {
          console.log(`Done fetching messages from ${folder}`);
          foldersProcessed++;
          if (foldersProcessed < folders.length) {
            processFolder(folders[foldersProcessed]);
          } else {
            checkCompletion();
          }
        });
      });
    }

    function checkCompletion() {
      if (foldersProcessed === folders.length && pendingParses === 0) {
        imap.end();
        resolve(allMails.reverse());
      }
    }

    imap.once("ready", () => {
      console.log("IMAP connected successfully");
      // Dynamically get folder names
      imap.getBoxes((err, boxes) => {
        if (err) {
          console.error("Error listing mailboxes:", err);
          imap.end();
          return reject(new Error(`Failed to list mailboxes: ${err.message}`));
        }

        // Common folder names for Junk, Trash, and Sent
        const folderAliases = {
          junk: ["Junk", "Spam", "Junk Email", "Bulk Mail", "[Gmail]/Spam"],
          trash: ["Trash", "Deleted Items", "[Gmail]/Trash"],
          sent: ["Sent", "Sent Items", "Sent Mail", "[Gmail]/Sent Mail"],
        };

        // Find matching folders
        const foundFolders = { junk: null, trash: null, sent: null };
        Object.keys(boxes).forEach((box) => {
          const normalizedBox = box.toLowerCase();
          if (folderAliases.junk.some((alias) => alias.toLowerCase() === normalizedBox)) {
            foundFolders.junk = box;
          }
          if (folderAliases.trash.some((alias) => alias.toLowerCase() === normalizedBox)) {
            foundFolders.trash = box;
          }
          if (folderAliases.sent.some((alias) => alias.toLowerCase() === normalizedBox)) {
            foundFolders.sent = box;
          }
        });

        // Add found folders to the processing list
        folders = ["INBOX"];
        if (foundFolders.junk) folders.push(foundFolders.junk);
        if (foundFolders.trash) folders.push(foundFolders.trash);
        if (foundFolders.sent) folders.push(foundFolders.sent);

        console.log("Folders to process:", folders);
        processFolder(folders[0]);
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      if (
        err.message.includes("AUTH") ||
        err.message.includes("authentication") ||
        err.message.includes("login")
      ) {
        imap.end();
        return reject(
          new Error(
            "IMAP authentication failed: Incorrect username or password"
          )
        );
      }
      imap.end();
      reject(new Error(`IMAP connection error: ${err.message}`));
    });

    imap.once("end", () => {
      console.log("IMAP connection ended");
    });

    try {
      imap.connect();
    } catch (err) {
      console.error("Failed to initiate IMAP connection:", err);
      reject(
        new Error("Failed to initiate IMAP connection: Invalid configuration")
      );
    }
  });
}

export async function deleteMail(imapConfig, seqno) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      ...imapConfig,
      tlsOptions: { rejectUnauthorized: false }, // Remove in production
    });

    function openInbox(cb) {
      imap.openBox("INBOX", false, cb); // false for read-write mode
    }

    imap.once("ready", () => {
      console.log("IMAP connected successfully for delete operation");
      openInbox((err, box) => {
        if (err) {
          console.error("Error opening INBOX:", err);
          imap.end();
          return reject(new Error(`Failed to open INBOX: ${err.message}`));
        }
        console.log(
          `INBOX opened for deletion, attempting to delete message ${seqno}`
        );

        // Add DELETED flag to the message
        imap.addFlags(seqno, "\\Deleted", (err) => {
          if (err) {
            console.error(
              `Error setting DELETED flag on message ${seqno}:`,
              err
            );
            imap.end();
            return reject(
              new Error(
                `Failed to mark message ${seqno} for deletion: ${err.message}`
              )
            );
          }

          // Expunge (permanently remove) messages marked as DELETED
          imap.expunge((err) => {
            if (err) {
              console.error(`Error expunging message ${seqno}:`, err);
              imap.end();
              return reject(
                new Error(`Failed to expunge message ${seqno}: ${err.message}`)
              );
            }

            console.log(`Message ${seqno} deleted successfully`);
            imap.end();
            resolve({ success: true, seqno });
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      if (
        err.message.includes("AUTH") ||
        err.message.includes("authentication") ||
        err.message.includes("login")
      ) {
        imap.end();
        return reject(
          new Error(
            "IMAP authentication failed: Incorrect username or password"
          )
        );
      }
      imap.end();
      reject(new Error(`IMAP connection error: ${err.message}`));
    });

    imap.once("end", () => {
      console.log("IMAP connection ended");
    });

    try {
      imap.connect();
    } catch (err) {
      console.error("Failed to initiate IMAP connection:", err);
      reject(
        new Error("Failed to initiate IMAP connection: Invalid configuration")
      );
    }
  });
}


export async function moveToTrash(imapConfig, seqno) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      ...imapConfig,
      keepalive: false, // Disable keepalive to prevent IDLE
      tlsOptions: { rejectUnauthorized: false }, // Remove in production
      debug: false, // Enable debugging
    });

    function openInbox(cb) {
      imap.openBox("INBOX", false, cb); // false for read-write mode
    }

    function ensureTrashFolder(callback) {
      imap.getBoxes((err, boxes) => {
        if (err) {
          console.error("Error listing folders:", err);
          return callback(err);
        }
        console.log("Available folders:", Object.keys(boxes));
        if (boxes[".Trash"]) {
          console.log("Trash folder exists");
          return callback(null);
        }
        console.log("Creating .Trash folder");
        imap.createBox(".Trash", (err) => {
          if (err) {
            console.error("Error creating .Trash folder:", err);
            return callback(err);
          }
          console.log(".Trash folder created successfully");
          callback(null);
        });
      });
    }

    imap.once("ready", () => {
      console.log("IMAP connected successfully for move operation");
      openInbox((err, box) => {
        if (err) {
          console.error("Error opening INBOX:", err);
          imap.end();
          return reject(new Error(`Failed to open INBOX: ${err.message}`));
        }
        console.log(`INBOX opened, validating sequence number ${seqno}`);

        // Validate seqno
        imap.seq.fetch("1:*", { bodies: "" }, (err, messages) => {
          if (err) {
            console.error("Error fetching messages:", err);
            imap.end();
            return reject(new Error(`Failed to fetch messages: ${err.message}`));
          }
          if (!messages) {
            console.error("No messages returned from FETCH");
            imap.end();
            return reject(new Error("No messages found in INBOX"));
          }
          const validSeqnos = messages.map((msg) => msg.seq);
          console.log("Valid sequence numbers:", validSeqnos);
          if (!validSeqnos.includes(seqno)) {
            console.error(`Invalid sequence number: ${seqno}`);
            imap.end();
            return reject(new Error(`Invalid sequence number: ${seqno}`));
          }

          // Ensure .Trash folder exists
          ensureTrashFolder((err) => {
            if (err) {
              console.error("Trash folder error:", err);
              imap.end();
              return reject(new Error(`Failed to ensure Trash folder: ${err.message}`));
            }

            // Move message to .Trash folder
            console.log(`Attempting to move message ${seqno} to .Trash`);
            imap.move(seqno, ".Trash", (err) => {
              if (err) {
                console.error(`Error moving message ${seqno} to Trash:`, err);
                imap.end();
                return reject(new Error(`Failed to move message to Trash: ${err.message}`));
              }
              console.log(`Message ${seqno} moved to Trash successfully`);

              // Verify the move
              imap.seq.fetch(seqno, { bodies: "" }, (err, messages) => {
                if (err) {
                  console.error("Error verifying move:", err);
                  imap.end();
                  return reject(new Error(`Failed to verify move: ${err.message}`));
                }
                if (messages.length === 0) {
                  console.log(`Confirmed: Message ${seqno} moved to Trash`);
                  setTimeout(() => {
                    imap.end();
                    resolve({ success: true, seqno });
                  }, 1000); // Delay to ensure server processes the move
                } else {
                  console.error(`Message ${seqno} still in INBOX after move`);
                  imap.end();
                  reject(new Error(`Message ${seqno} still in INBOX after move attempt`));
                }
              });
            });
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      imap.end();
      if (
        err.message.includes("AUTH") ||
        err.message.includes("authentication") ||
        err.message.includes("login")
      ) {
        return reject(
          new Error("IMAP authentication failed: Incorrect username or password")
        );
      }
      reject(new Error(`IMAP connection error: ${err.message}`));
    });

    imap.once("end", () => {
      console.log("IMAP connection ended");
    });

    try {
      imap.connect();
    } catch (err) {
      console.error("Failed to initiate IMAP connection:", err);
      reject(
        new Error("Failed to initiate IMAP connection: Invalid configuration")
      );
    }
  });
}

export async function sendMail(smtpConfig, mailOptions) {
  // Input validation
  if (!smtpConfig || !smtpConfig.host || !smtpConfig.port || !smtpConfig.user || !smtpConfig.pass) {
    throw new Error("Invalid SMTP configuration: Missing required fields");
  }
  if (!mailOptions || !mailOptions.to || !mailOptions.subject || (!mailOptions.text && !mailOptions.html)) {
    throw new Error("Invalid mail options: Missing to, subject, or body");
  }

  return new Promise((resolve, reject) => {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: false, // Use STARTTLS for port 587
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      requireTLS: true,
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
      logger: false,
      debug: false
    });

    // Create IMAP connection for storing in Sent folder
    const imap = new Imap({
      user: smtpConfig.user,
      password: smtpConfig.pass,
      host: smtpConfig.host.replace("smtp", "imap"), // e.g., smtp.gmail.com -> imap.gmail.com
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }, // Remove in production
    });

    // Function to find Sent folder
    function findSentFolder(boxes) {
      const sentAliases = ["Sent", "Sent Items", "Sent Mail", "[Gmail]/Sent Mail"];
      for (const box of Object.keys(boxes)) {
        if (sentAliases.some(alias => alias.toLowerCase() === box.toLowerCase())) {
          return box;
        }
      }
      return "Sent"; // Fallback to "Sent"
    }

    // Function to append email to Sent folder
    function appendToSentFolder(message, sentFolder, callback) {
      imap.append(message, { mailbox: sentFolder, flags: ["\\Seen"] }, (err) => {
        if (err) {
          console.warn(`Failed to append to ${sentFolder}: ${err.message}`);
        } else {
          console.log(`Email appended to ${sentFolder} successfully`);
        }
        callback(err);
      });
    }

    // Verify SMTP connection and send email
    transporter.verify((err) => {
      if (err) {
        console.error("SMTP connection verification failed:", {
          error: err.message,
          host: smtpConfig.host,
          port: smtpConfig.port,
          user: smtpConfig.user,
        });
        if (err.message.includes("authentication") || err.message.includes("login")) {
          return reject(new Error("SMTP authentication failed: Incorrect username or password"));
        }
        return reject(new Error(`SMTP connection error: ${err.message}`));
      }

      console.log("SMTP connection verified:", { host: smtpConfig.host, port: smtpConfig.port });

      // Send email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", {
            error: err.message,
            code: err.code,
            command: err.command
          });
          imap.end();
          return reject(new Error(`Failed to send email: ${err.message}`));
        }

        console.log("Email sent successfully:", { messageId: info.messageId });

        // Connect to IMAP to store in Sent folder
        imap.once("ready", () => {
          console.log("IMAP connected successfully for storing email");
          imap.getBoxes((err, boxes) => {
            if (err) {
              console.warn("Error listing mailboxes:", err);
              imap.end();
              return resolve({ success: true, messageId: info.messageId, storedInSent: false });
            }

            const sentFolder = findSentFolder(boxes);
            console.log(`Using Sent folder: ${sentFolder}`);

            // Convert mailOptions to raw email format
            const rawMessage = `From: ${mailOptions.from}\r\n` +
                               `To: ${mailOptions.to}\r\n` +
                               `Subject: ${mailOptions.subject}\r\n` +
                               `Date: ${new Date().toUTCString()}\r\n` +
                               `Message-ID: ${info.messageId}\r\n` +
                               (mailOptions.text ? `\r\n${mailOptions.text}` : "") +
                               (mailOptions.html ? `\r\n${mailOptions.html}` : "");

            appendToSentFolder(rawMessage, sentFolder, (err) => {
              imap.end();
              if (err) {
                console.warn(`Failed to store email in ${sentFolder}, but email was sent`);
                resolve({ success: true, messageId: info.messageId, storedInSent: false });
              } else {
                resolve({ success: true, messageId: info.messageId, storedInSent: true });
              }
            });
          });
        });

        imap.once("error", (err) => {
          console.warn("IMAP connection error for storing email:", err);
          imap.end();
          resolve({ success: true, messageId: info.messageId, storedInSent: false });
        });

        imap.once("end", () => {
          console.log("IMAP connection ended");
        });

        try {
          imap.connect();
        } catch (err) {
          console.warn("Failed to initiate IMAP connection for storing email:", err);
          resolve({ success: true, messageId: info.messageId, storedInSent: false });
        }
      });
    });
  });
}