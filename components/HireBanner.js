import React from "react";
import { useRouter } from "next/router";

import en from "../locales/en";
import fr from "../locales/fr";

export default function HireBanner() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "en" ? en : fr;

  return (
    <section className="hire-banner">
      <div className="hire-banner__card">
        <h2 className="section-heading-blue hire-banner__heading">{t.hire.heading}</h2>
        <p className="hire-banner__text">{t.hire.text}</p>
        <div className="hire-banner__buttons">
          <a
            href="https://www.yanakrukovets.com/projects"
            className="hire-banner__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hire.projects}
          </a>
          <a
            href="https://www.yanakrukovets.com/#about"
            className="hire-banner__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hire.about}
          </a>
          <a
            href="https://www.yanakrukovets.com/contact"
            className="hire-banner__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hire.contact}
          </a>
        </div>
      </div>
    </section>
  );
}
