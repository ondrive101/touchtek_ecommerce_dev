import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createNewChat, subscribeToError } from "./chat-config";

const MyProfileHeader = ({ contacts }) => {
  const session = useSession();
  const profile = session?.data?.user;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleStartChat = () => {
    if (selectedContact) {
      createNewChat(selectedContact, (response) => {});
      setIsDialogOpen(false);
      setSelectedContact(null);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.image} alt="" />
            <AvatarFallback>{profile?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="block">
            <div className="text-sm font-medium text-default-900 ">
              <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-success before:absolute before:top-1.5 before:-right-3 capitalize">
                {profile?.name}
              </span>
            </div>
            <span className="text-xs text-default-600">{profile?.id}</span>
            <span className="text-xs text-default-600 ml-1 capitalize">
              {profile?.department}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg h-8 w-8 bg-primary hover:bg-primary/90"
          onClick={() => setIsDialogOpen(true)}
        >
          <Icon icon="material-symbols:add" className="text-lg text-white" />
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Chat</DialogTitle>
              <DialogDescription>
                Select a contact to start a new chat
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {contacts?.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-slate-100 mb-2 ${
                      selectedContact?.id === contact.id ? "bg-slate-100" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact?.image} alt="" />
                      <AvatarFallback>
                        {contact.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {contact.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contact.id} - {contact.departmentName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStartChat}
                disabled={!selectedContact}
              >
                Start Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* search */}
      <InputGroup merged className="hidden lg:flex">
        <InputGroupText>
          <Icon icon="heroicons:magnifying-glass" />
        </InputGroupText>
        <Input type="text" placeholder="Search by name" />
      </InputGroup>
      {/* actions */}
      <div className="hidden lg:flex flex-wrap justify-between py-4 border-b border-default-200">
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="gala:chat" />
          </span>
          <span className="text-xs">Chats</span>
        </Button>
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="material-symbols:group" />
          </span>
          <span className="text-xs">Groups</span>
        </Button>
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="ci:bell-ring" />
          </span>
          <span className="text-xs">Notification</span>
        </Button>
      </div>
    </>
  );
};

export default MyProfileHeader;
