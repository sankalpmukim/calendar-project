import Head from "next/head";
import { useState } from "react";
import EmailVerification from "~/components/signup/EmailVerification";
import Registration from "~/components/signup/Registration";

type SignupPage = "registration" | "confirm" | "profile";
export default function Signup() {
  const [page, setPage] = useState<SignupPage>("registration");
  const [userId, setUserId] = useState<string>("");
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      {page === "registration" && (
        <Registration
          callNextPage={function (userId: string): void {
            setPage("confirm");
            setUserId(userId);
          }}
        />
      )}
      {page === "confirm" && (
        <EmailVerification
          callNextPage={function (): void {
            setPage("profile");
          }}
          userId={userId}
        />
      )}
    </>
  );
}
