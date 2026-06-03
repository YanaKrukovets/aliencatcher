import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found | AlifallX</title>
        <meta name="description" content="This page does not exist. Head back to AlifallX to play the game." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-[72vh] flex flex-col justify-center items-center">
        <h1 className="text-[50px]">404</h1>
        <h2 className="text-[20px]">Page Not Found</h2>
      </div>
    </>
  );
}
