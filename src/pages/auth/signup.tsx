import Head from "next/head";
import Registration from "~/components/signup/Registration";

export default function signup() {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Registration />
    </>
  );
}
