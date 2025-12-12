import Main from "./components/main";
import { getServerSession } from "next-auth";
import { getCustomerBy_Id } from "@/action/superadmin/controller";
import { authOptions } from "@/lib/auth";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const customer = await getCustomerBy_Id(params.id, session);
 return (
    <div>
      <Main session={session} customer={customer?.data}/>
    </div>
  );
}
