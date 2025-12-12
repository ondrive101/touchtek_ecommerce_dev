import Main from "./components/main";
import { getServerSession } from "next-auth";
import { getCustomerList_Sales } from "@/action/superadmin/controller";
import { authOptions } from "@/lib/auth";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const customersList = await getCustomerList_Sales(session);



  return (
    <div>
      <Main list={customersList?.data} session={session}/>
    </div>
  );
}
