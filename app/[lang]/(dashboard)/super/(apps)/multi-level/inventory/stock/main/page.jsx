import { getProductList_Inventory} from "@/action/superadmin/controller";
import Main from "./components/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StockPage({ params }) {
  const session = await getServerSession(authOptions);
  const productList = await getProductList_Inventory(session)

 
  return (
    <div>
      <Main productList={productList?.data} session={session}/>
    </div>
  );
}
