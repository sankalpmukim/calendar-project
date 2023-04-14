import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import EmailVerification from "~/components/signup/EmailVerification";
import Profile from "~/components/signup/Profile";
import Registration from "~/components/signup/Registration";

type SignupPage = "registration" | "confirm" | "profile";
export default function Signup() {
  const [page, setPage] = useState<SignupPage>("registration");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
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
      {page === "profile" && (
        <Profile
          callNextPage={function (): void {
            console.log("Profile created");
            void router.push("/auth/login");
          }}
          userId={userId}
        />
      )}
    </>
  );
}
