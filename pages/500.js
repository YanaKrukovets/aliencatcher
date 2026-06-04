import Head from "next/head";
import Link from "next/link";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 — Server Error | AlifallX</title>
        <meta name="description" content="Something went wrong on our end. Please try again." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-[72vh] flex flex-col justify-center items-center gap-4">
        <h1 className="text-[50px]">500</h1>
        <h2 className="text-[20px]">Server-side error occurred</h2>
        <Link href="/" className="underline text-[16px]">Back to home</Link>
      </div>
    </>
  );
}
