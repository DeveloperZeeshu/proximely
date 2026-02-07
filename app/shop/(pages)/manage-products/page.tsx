import { Suspense } from "react";
import ManageProducts from "./ManageProducts";

export default function Page(){
    return (
        <Suspense fallback={null}>
            <ManageProducts />
        </Suspense>
    )
}