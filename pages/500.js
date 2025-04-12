import Head from "next/head";

export default function Custom500() {
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="description" />
      </Head>
      <div className="min-h-[72vh] flex flex-col justify-center items-center">
        <h1 className="text-[50px]">500</h1>
        <h2 className="text-[20px]">Server-side error occurred</h2>
      </div>
    </>
  );
}
