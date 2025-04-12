/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function NavLangToggle() {
  const router = useRouter();
  const { locale, asPath } = router;

  return (
    <>
      <div className="nav-lang-toggle text-gray">
        <Link href={asPath} locale={locale === "en" ? "fr" : "en"}>
          <span>{locale === "en" ? "FR" : "EN"}</span>
        </Link>
      </div>
    </>
  );
}
