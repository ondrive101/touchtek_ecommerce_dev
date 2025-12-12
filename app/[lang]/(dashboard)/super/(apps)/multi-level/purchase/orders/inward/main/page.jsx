// import { getUsersList_SuperAdmin,getOrdersList_Purchase} from "@/config/main.config";
import Main from "./components/main";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductList, getSupplierList,getPurchaseOrderList } from "@/action/purchase/controller";

export default async function OrdersPage({ params }) {
  const session = await getServerSession(authOptions);
  const supplierList = await getSupplierList(session)
  const productList = await getProductList(session)
  const purchaseOrderList = await getPurchaseOrderList(session)


  return (
    <div>
      <Main ordersList={purchaseOrderList?.data} session={session} supplierList={supplierList?.data} productList={productList?.data}/>
    </div>
  );
}
