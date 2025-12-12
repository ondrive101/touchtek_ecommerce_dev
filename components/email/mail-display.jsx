import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import avatar from "@/public/images/avatar/avatar-2.jpg";
const MailDisplay = ({ mail }) => {
  const { subject, name, from, text } = mail;
  return (
    <div className="flex h-full flex-col px-6 mt-2">
      <div>
        <div className="text-lg font-medium text-default-900">{subject}</div>
        <div className="flex items-center gap-2 mt-6">
          <Avatar className="h-11 w-11">
            <AvatarImage src={avatar.src} alt="" />
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-default-900 capitalize">
              {name}
            </div>
            <div className="text-sm text-default-600">{from}</div>
          </div>
        </div>
        <div className="mt-8">
          <div className="space-y-4">
            <div className="text-sm text-default-600">{text}</div>
          </div>
        </div>
        <div className="border border-dashed border-default-300 mt-6 mb-5"></div>
        <div className="flex items-center gap-4 pb-5">
          <Button>
            <Icon
              icon="heroicons:arrow-uturn-left"
              className="w-4 h-4 ltr:mr-1 rtl:ml-1"
            />{" "}
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MailDisplay;
