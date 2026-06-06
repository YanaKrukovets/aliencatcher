import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import en from "../locales/en";
import fr from "../locales/fr";

export default function Footer() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "en" ? en : fr;

  return (
    <footer className="max-w-inner xxxl:px-0 purple">
      <div className="footer-wrapper">
        <div className="max-w-wrapper px-5 mx-auto">
          <div className="footer-top">
            <div className="footer-brand">
              <p className="footer-brand__name">AlifallX</p>
              <p className="footer-brand__tagline">Don&apos;t Leave Them Behind</p>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              <div className="footer-nav__col">
                <Link href="/game" className="footer-nav__link">
                  {t.footer.nav_play}
                </Link>
                <Link href="/#aboutgame" className="footer-nav__link">
                  {t.footer.nav_about}
                </Link>
                <Link href="/#faq" className="footer-nav__link">
                  {t.footer.nav_faq}
                </Link>
              </div>
              <div className="footer-nav__col">
                <Link href="/contact" className="footer-nav__link">
                  {t.footer.nav_contact}
                </Link>
                <Link href="/privacy-policy" className="footer-nav__link">
                  {t.footer.nav_privacy}
                </Link>
              </div>
            </nav>
          </div>
          <hr className="footer-divider" />
          <p className="footer-copyright">© Yana Krukovets, 2026</p>
        </div>
      </div>
    </footer>
  );
}
