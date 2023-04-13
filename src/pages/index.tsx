import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "~/components/Layout";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Calendar </title>
        <meta name="description" content="Basic calendar implementation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>Your mom</Layout>
    </>
  );
};

export default Home;
