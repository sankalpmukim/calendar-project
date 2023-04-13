import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  shortDescription: string;
}

export default function Layout({ title, shortDescription, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="w-full space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {shortDescription}
            </p>
          </div>

          <form className="bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 md:p-8">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {children}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
