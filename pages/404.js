import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>
      <div className="min-h-[72vh] flex flex-col justify-center items-center">
        <h1 className="text-[50px]">404</h1>
        <h2 className="text-[20px]">Page Not Found</h2>
      </div>
    </>
  );
}
