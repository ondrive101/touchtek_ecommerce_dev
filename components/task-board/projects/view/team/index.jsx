"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import TeamHeader from "./team-header";
import TeamCard from "./team-card";
import { Button } from "@/components/ui/button";

const Team = ({project}) => {

  return (
    <Card>
      <CardHeader className="lg:flex-row">
        <TeamHeader project={project} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {project?.members?.map((item, index) => (
            <TeamCard key={`team` + index} item={item} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center mt-5">
        <Button
          type="button"
          className="bg-default-200 text-default-500 hover:bg-default-300 hover:text-default-900"
        >
          Load More...
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Team;
