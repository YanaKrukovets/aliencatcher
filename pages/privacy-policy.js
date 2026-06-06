import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — AlifallX</title>
        <meta name="description" content="Privacy policy for AlifallX: Don't Leave Them Behind." />
        <link rel="canonical" href="https://www.alifallx.com/privacy-policy" />
        <meta property="og:url" content="https://www.alifallx.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy — AlifallX" />
        <meta property="og:description" content="Privacy policy for AlifallX: Don't Leave Them Behind." />
        <meta property="og:image" content="https://www.alifallx.com/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy — AlifallX" />
        <meta name="twitter:description" content="Privacy policy for AlifallX: Don't Leave Them Behind." />
        <meta name="twitter:image" content="https://www.alifallx.com/images/og-image.png" />
      </Head>

      <div className="policy-page">
        <div className="policy-page__inner">
          <p className="policy-page__label">Legal</p>
          <h1 className="policy-page__heading">Privacy Policy</h1>
          <p className="policy-page__updated">Last updated: June 2026</p>

          <section className="policy-page__section">
            <h2>Overview</h2>
            <p>
              AlifallX (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a
              free browser game created by Yana Krukovets. We respect your
              privacy and are committed to being transparent about what
              information, if any, we collect.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Information We Collect</h2>
            <p>
              AlifallX does not require you to create an account or log in.
              We do not collect personal information from players simply by
              playing the game.
            </p>
            <p>
              If you contact us via the{" "}
              <Link href="/contact" className="policy-page__link">
                contact form
              </Link>
              , we collect the name and email address you provide so we can
              respond to your message. This information is processed by{" "}
              <a
                href="https://formspree.io/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="policy-page__link"
              >
                Formspree
              </a>{" "}
              and is only used to reply to you.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Cookies and Tracking</h2>
            <p>
              We do not use tracking cookies or analytics services on this
              site. No third-party advertising or profiling is performed.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Third-Party Services</h2>
            <p>
              The contact form is powered by{" "}
              <a
                href="https://formspree.io"
                target="_blank"
                rel="noopener noreferrer"
                className="policy-page__link"
              >
                Formspree
              </a>
              . When you submit the form, your data is processed according to
              Formspree&apos;s own privacy policy. We encourage you to review
              it if you have questions about how that data is stored.
            </p>
            <p>
              The site is hosted on Vercel. Vercel may log standard server
              access information (IP address, browser type, pages visited) as
              part of normal hosting operations.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Your Rights</h2>
            <p>
              If you have contacted us via the form and wish to have your
              message data deleted, please email us at{" "}
              <a href="mailto:yanashelli@gmail.com" className="policy-page__link">
                yanashelli@gmail.com
              </a>{" "}
              and we will fulfill your request promptly.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Any changes will be
              reflected on this page with an updated date at the top.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>Contact</h2>
            <p>
              Questions about this policy? Reach us at{" "}
              <a href="mailto:yanashelli@gmail.com" className="policy-page__link">
                yanashelli@gmail.com
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="policy-page__link">
                contact page
              </Link>
              .
            </p>
          </section>

          <Link href="/" className="policy-page__back-link">
            <span aria-hidden="true">← </span>Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
