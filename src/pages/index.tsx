import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/layout/Layout";

const Home: NextPage = () => {
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
