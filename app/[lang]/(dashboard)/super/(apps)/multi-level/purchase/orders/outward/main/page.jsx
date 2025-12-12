import Main from "./components/main";
import { getServerSession } from "next-auth";
import { getSupplierList } from "@/action/superadmin/controller";
import { authOptions } from "@/lib/auth";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const supplierList = await getSupplierList(session);





  return (
    <div>
      <Main list={supplierList?.data} session={session}/>
    </div>
  );
}
 