
import Main from "./components/main";
import { getServerSession } from "next-auth";
import { getTaskProject } from "@/action/task/controller";
import { authOptions } from "@/lib/auth";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const {id} = params;
  const project = await getTaskProject(id, session);
  return (
    <div>
      <Main project={project?.data}/>
    </div>
  );
}