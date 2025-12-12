"use client";
import OverdueTask from "./overdue-task";
import ProjectBudget from "./project-budget";
import ProjectDeadline from "./project-deadline";
import BoardTaskDist from "./board-task-dist";
import ReportChart from "./report-chart";
import TopContributer from "./top-contributer";
import UpcomingDeadline from "./upcoming-deadlines";
import MemberStatistics from "./member-statistics";
import WorkloadChart from "./workload";
import WorksNote from "./works-note";

const Overview = ({project}) => {




  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 2xl:col-span-3">
          <MemberStatistics  project={project}/>
        </div>
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-4">
          <BoardTaskDist  project={project}/>
        </div>
        <div className="col-span-12 2xl:col-span-5">
          <WorkloadChart  project={project}/>
        </div>
      </div>
   
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
        <OverdueTask project={project}/>

        </div>
        <div className="col-span-12 lg:col-span-6">
          <UpcomingDeadline project={project}/>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <TopContributer  project={project}/>
        </div>
        <div className="col-span-12 lg:col-span-6">
          {/* <WorksNote /> */}
        </div>
      </div>
    </div>
  );
};

export default Overview;
