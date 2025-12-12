import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import avatar1 from "@/public/images/avatar/avatar-4.jpg";

const TeamCard = ({ item }) => {
  const stats = [
    {
      name: "Total Task",
      count: "223",
      color: "primary",
    },
    {
      name: "Completed",
      count: "123",
      color: "success",
    },
    {
      name: "Incomplete",
      count: "143",
      color: "info",
    },
    {
      name: "Overdue Task",
      count: "123",
      color: "destructive",
    },
  ];

  const { name, company, avatar, departmentName } = item;

  return (
    <Card className="p-6 bg-background">
      <CardContent className="p-0">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full overflow-hidden">
            <Image
              src={avatar || avatar1}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name and Department */}
        <div className="text-center text-lg font-medium text-default-800 mt-3 capitalize">
          {name}
        </div>
        <div className="text-center text-sm text-default-600">
          {departmentName} at <span className="text-primary">{company}</span>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            asChild
            variant="secondary"
            className="bg-default-100 text-default-500"
          >
            <Link href="/dashboard" className="whitespace-nowrap">
              View Profile
            </Link>
          </Button>
          <Button>Message</Button>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((listItem, index) => (
            <div
              key={index}
              className={`
                flex flex-col items-center p-3 rounded 
                bg-${listItem.color}/10
              `}
            >
              <div className="text-sm font-medium text-default-600 capitalize whitespace-nowrap">
                {listItem.name}:
              </div>
              <div className={`text-sm font-semibold text-${listItem.color}`}>
                {listItem.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
