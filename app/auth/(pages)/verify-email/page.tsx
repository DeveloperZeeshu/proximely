import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailClient";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailPage />
        </Suspense>
    )
}