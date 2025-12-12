"use client";
import View from "@/components/task-board/projects/view";



const Main = ({
  project
}) => {
  return (
    <>
      <View
        project={project}
      />
    </>
  );
};

export default Main;
