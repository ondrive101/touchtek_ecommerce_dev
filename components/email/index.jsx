"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import MailDisplay from "./mail-display";
import MailSetup from "./mail-setup";
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MailHeader from "./mail-header";
import MailSpam from "./mail-spam";
import ComposeMail from "./compose-mail";
import Labels from "./labels";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

const Mail = ({
  pathname,
  session,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  mailSetup,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isPending, startTransition] = React.useTransition();
  const [activeTab, setActiveTab] = useState("primary");

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };
  const filteredPrimaryMails = mails.filter((mail) => mail.folder === "INBOX");
  const filteredSendMails = mails.filter((mail) => mail.folder === "Sent");
  const filteredSpamMails = mails.filter((mail) => mail.folder === "Spam");

  // mail state
  const [selectedMail, setSelectedMail] = React.useState(null);
  const [openSpam, setOpenSpam] = React.useState(false);
  // state for compose mail
  const [openComposeMail, setOpenComposeMail] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const handleSelectedMail = (id) => {
    startTransition(async () => {
      // const mail = await getMailAction(id);
      const mail = mails.find((mail) => mail.id === id);
      setSelectedMail(mail);
    });
  };
  const closeSelectedMail = () => setSelectedMail(null);
  const isDesktop = useMediaQuery("(max-width: 1280px)");

  if (mailSetup?.isMailSetup === false) {
    return <MailSetup pathname={pathname} session={session} />;
  }

  return (
    <>
      {openComposeMail && (
        <ComposeMail
          onClose={() => setOpenComposeMail(false)}
          session={session}
        />
      )}
      <div className="app-height overflow-hidden  relative z-10">
        {isDesktop && showSidebar && (
          <div
            className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}
        {isDesktop && showSidebar && (
          <div
            className={cn(
              "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]",
              {
                "left-0": isDesktop && showSidebar,
                "-left-full": isDesktop && !showSidebar,
              }
            )}
          >
            <Card className="h-full pb-0 overflow-auto no-scrollbar">
              <CardHeader
                className={cn(
                  "border-none xl:mb-0 xl:pb-0 sticky z-50 bg-card top-0  px-6  "
                )}
              >
                <Button
                  onClick={() => setOpenComposeMail(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 ltr:mr-1 rtl:ml-1.5" />
                  Compose
                </Button>
              </CardHeader>
              <CardContent>
              <Nav
                      isCollapsed={isCollapsed}
                      onNavClick={(value) => handleTabClick(value)}
                      links={[
                    
                        {
                          title: "inbox",
                          icon: "heroicons:envelope",
                          label: filteredPrimaryMails.length,
                          value: "primary",
                          active: true,
                        },
                        {
                          title: "Starred",
                          icon: "heroicons:star",
                          label: "",
                          value: "starred",
                        },
                        {
                          title: "sent",
                          icon: "heroicons:paper-airplane",
                          label: filteredSendMails.length,
                          value: "sent",
                        },
                        {
                          title: "drafts",
                          icon: "heroicons:pencil-square",
                          label: "",
                          value: "draft",
                        },
                        {
                          title: "importants",
                          icon: "heroicons:tag",
                          label: "",
                          value: "important",
                        },
                        {
                          title: "spam",
                          icon: "heroicons:exclamation-circle",
                          label: "",
                          value: "spam",
                        },
                        {
                          title: "trash",
                          icon: "heroicons:trash",
                          label: "",
                          value: "trash",
                        },
                      ]}
                    />
                <div
                  className={cn(
                    "mt-4 mb-2 text-xs font-medium text-default-800 uppercase mx-4",
                    {
                      "mx-1 ": isCollapsed,
                    }
                  )}
                >
                  Labels
                </div>
                <Labels
                  isCollapsed={false}
                  items={[
                    {
                      label: "work",
                      total: "",
                      color: "primary",
                    },
                    {
                      label: "company",
                      total: "",
                      color: "warning",
                    },
                    {
                      label: "private",
                      total: "",
                      color: "success",
                    },
                    {
                      label: "group",
                      total: "",
                      color: "destructive",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        )}
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="relative "
          >
            {!isDesktop && (
              <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={15}
                maxSize={20}
                onCollapse={(collapsed) => {
                  setIsCollapsed(collapsed);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    true
                  )}`;
                }}
                className={cn(
                  "",
                  isCollapsed &&
                    "min-w-[50px] transition-all duration-300 ease-in-out "
                )}
              >
                <Card className="h-full overflow-auto no-scrollbar">
                  <CardHeader
                    className={cn(
                      "border-none mb-0 pb-0 sticky bg-card top-0  px-6 z-[99]",
                      {
                        "px-2": isCollapsed,
                      }
                    )}
                  >
                    <Button
                      size={isCollapsed ? "icon" : ""}
                      onClick={() => setOpenComposeMail(true)}
                      className={isCollapsed ? "w-full" : ""}
                    >
                      <Plus
                        className={cn("w-4 h-4 ltr:mr-1 rtl:ml-1", {
                          "mr-0 w-5 h-5": isCollapsed,
                        })}
                      />
                      {!isCollapsed && "Compose"}
                    </Button>
                  </CardHeader>
                  <CardContent
                    className={cn("", {
                      "px-2": isCollapsed,
                    })}
                  >
                    <Nav
                      isCollapsed={isCollapsed}
                      onNavClick={(value) => handleTabClick(value)}
                      links={[
              
                        {
                          title: "inbox",
                          icon: "heroicons:envelope",
                          label: filteredPrimaryMails.length,
                          value: "primary",
                          active: true,
                        },
                        {
                          title: "Starred",
                          icon: "heroicons:star",
                          label: "",
                          value: "starred",
                        },
                        {
                          title: "sent",
                          icon: "heroicons:paper-airplane",
                          label: filteredSendMails.length,
                          value: "sent",
                        },
                        {
                          title: "drafts",
                          icon: "heroicons:pencil-square",
                          label: "",
                          value: "draft",
                        },
                        {
                          title: "importants",
                          icon: "heroicons:tag",
                          label: "",
                          value: "important",
                        },
                        {
                          title: "spam",
                          icon: "heroicons:exclamation-circle",
                          label: "",
                          value: "spam",
                        },
                        {
                          title: "trash",
                          icon: "heroicons:trash",
                          label: "",
                          value: "trash",
                        },
                      ]}
                    />

                    <Separator />
                    {!isCollapsed && (
                      <div
                        className={cn(
                          "mt-4 mb-2 text-xs font-medium text-default-800 uppercase mx-4",
                          {
                            "mx-1 ": isCollapsed,
                          }
                        )}
                      >
                        Labels
                      </div>
                    )}
                    <Labels
                      isCollapsed={isCollapsed}
                      items={[
                        {
                          label: "work",
                          total: "",
                          color: "primary",
                        },
                        {
                          label: "company",
                          total: "",
                          color: "warning",
                        },
                        {
                          label: "private",
                          total: "",
                          color: "success",
                        },
                        {
                          label: "group",
                          total: "",
                          color: "destructive",
                        },
                      ]}
                    />
                    <Separator />
                  </CardContent>
                </Card>
              </ResizablePanel>
            )}
            {!isDesktop && <ResizableHandle withHandle />}
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <Card className=" h-full">
                <CardContent className=" overflow-y-auto no-scrollbar h-full px-0">
                  {!isPending && (
                    <div className=" pt-6   rounded-t-md flex space-y-1.5 px-6 border-b border-border border-none flex-row gap-4 flex-wrap mb-1 sticky top-0 bg-card z-50">
                      <MailHeader
                        selectedMail={selectedMail}
                        onClose={closeSelectedMail}
                        handleSpam={() => setOpenSpam(!openSpam)}
                        handleSidebar={() => setShowSidebar(!showSidebar)}
                      />
                    </div>
                  )}
                  {selectedMail ? (
                    <MailDisplay mail={selectedMail} />
                  ) : (
                    <>
                      {isPending && <div>Loading...</div>}
                      {!isPending && (
                        <Tabs value={activeTab} defaultValue="primary" onValueChange={(value) => handleTabClick(value)}>
                          <div className="flex items-center py-2">
                            <TabsList className="bg-transparent gap-2 lg:gap-6 w-full justify-start pl-6 lg:pl-0">

                              {activeTab === "primary" && (
                              <TabsTrigger
                                value="primary"
                                className="capitalize  data-[state=active]:shadow-none pl-0   data-[state=active]:bg-transparent data-[state=active]:text-primary transition duration-150 before:transition-all before:duration-150 relative before:absolute
                              before:left-1/2 before:-bottom-[5px] before:h-[2px] w-fit md:min-w-[126px]
                                before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-primary data-[state=active]:before:w-full"
                              >
                                <Icon
                                  icon="heroicons:envelope"
                                  className="h-4 w-4 currentColor me-1 hidden sm:block"
                                />
                                Primary
                              </TabsTrigger>
                              )}
                              {activeTab === "sent" && (
                              <TabsTrigger
                                value="sent"
                                className="capitalize  data-[state=active]:shadow-none pl-0 data-[state=active]:bg-transparent data-[state=active]:text-primary transition duration-150 before:transition-all before:duration-150 relative before:absolute
                              before:left-1/2 before:-bottom-[5px] before:h-[2px]  w-fit md:min-w-[126px]
                                before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-primary data-[state=active]:before:w-full"
                              >
                                <Icon
                                  icon="heroicons:user-group"
                                  className="h-4 w-4 currentColor me-1 hidden sm:block"
                                />
                                Sent
                              </TabsTrigger>
                              )}
                              {activeTab === "spam" && (
                              <TabsTrigger
                                value="spam"
                                className="capitalize  data-[state=active]:shadow-none pl-0  data-[state=active]:bg-transparent data-[state=active]:text-primary transition duration-150 before:transition-all before:duration-150 relative before:absolute
                              before:left-1/2 before:-bottom-[5px] before:h-[2px]  w-fit md:min-w-[126px]
                                before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-primary data-[state=active]:before:w-full"
                              >
                                <Icon
                                  icon="heroicons:ticket"
                                  className="h-4 w-4 currentColor me-1 hidden sm:block"
                                />
                                Spam
                              </TabsTrigger>
                              )}
                            </TabsList>
                          </div>
                          <TabsContent
                            value="primary"
                            className="m-0 overflow-hidden"
                          >
                            {filteredPrimaryMails?.length ? (
                              filteredPrimaryMails.map((mail, index) => (
                                <MailList
                                  key={`mail-key1${index}`}
                                  mail={mail}
                                  handleSelectedMail={handleSelectedMail}
                                  session={session}
                                  pathname={pathname}
                                />
                              ))
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No mails found.
                              </div>
                            )}
                          </TabsContent>
                          <TabsContent
                            value="sent"
                            className="m-0 overflow-hidden"
                          >
                            {filteredSendMails?.length ? (
                              filteredSendMails.map((mail, index) => (
                                <MailList
                                  key={`mail-key2${index}`}
                                  mail={mail}
                                  handleSelectedMail={handleSelectedMail}
                                  session={session}
                                  pathname={pathname}
                                />
                              ))
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No mails found.
                              </div>
                            )}
                          </TabsContent>
                          <TabsContent
                            value="spam"
                            className="m-0 overflow-hidden"
                          >
                              {filteredSpamMails?.length ? (
                              filteredSpamMails.map((mail, index) => (
                                <MailList
                                  key={`mail-key3${index}`}
                                  mail={mail}
                                  handleSelectedMail={handleSelectedMail}
                                  session={session}
                                  pathname={pathname}
                                />
                              ))
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No mails found.
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
      <MailSpam open={openSpam} onClose={() => setOpenSpam(false)} />
    </>
  );
};

export default Mail;
