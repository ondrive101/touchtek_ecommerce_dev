import { getProductBy_Id } from "@/action/superadmin/controller";
import Main from "./components/product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductViewPage({ params }) {
  console.log(params.id)
  const session = await getServerSession(authOptions);
  const product = await getProductBy_Id(params.id, session)

  console.log(product)

  return (
    <div>
      <Main session={session} product={product?.data}/>
    </div>
  );
}
