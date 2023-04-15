import { GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import Head from "next/head"

interface Props {
  verified: boolean;
}

export default function VerifyEmail({ verified }: Props) {
  return (
    <>
    <Head>
      <title>{`Email Verification`}</title>
    </Head>
      <div className="flex h-full items-center bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {verified
              ? "Your email has been verified."
              : "Your email could not be verified."}
          </h2>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { secret } = context.query;
  if (typeof secret !== "string") {
    return {
      notFound: true,
    };
  }

  const response = await prisma.verificationSecret.findUnique({
    where: {
      secret,
    },
    include: {
      user: true,
    },
  });

  if (!response) {
    return {
      notFound: true,
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: response.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.verificationSecret.delete({
      where: {
        secret,
      },
    }),
  ]);
  return {
    props: {
      verified: true,
    },
  };
};
