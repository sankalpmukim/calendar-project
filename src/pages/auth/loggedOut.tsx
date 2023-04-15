import { LockClosedIcon, PlusIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LoggedOut() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        {/* you have been succesfully logged out, go to home page or login page or signup page */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{`You have been successfully logged out.`}</h1>
        </div>
        <div className="flex min-h-screen w-1/2 flex-col items-center justify-center gap-4 px-4 py-12 sm:px-6 lg:px-8">
          <button
            type="submit"
            onClick={function (): void {
              void router.push("/");
            }}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            {`Go to home page`}
          </button>
          <button
            type="submit"
            onClick={function (): void {
              void router.push("/auth/login");
            }}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            {`Login again`}
          </button>
          <button
            type="submit"
            onClick={function (): void {
              void router.push("/auth/signup");
            }}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <PlusIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            {`Create a new account`}
          </button>
        </div>
      </main>
    </>
  );
}
