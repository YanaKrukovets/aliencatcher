import Head from "next/head";
import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mjvllaww");

  return (
    <>
      <Head>
        <title>Contact — AlifallX</title>
        <meta name="description" content="Have a question about AlifallX? Get in touch with Yana Krukovets." />
        <link rel="canonical" href="https://www.alifallx.com/contact" />
        <meta property="og:url" content="https://www.alifallx.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact — AlifallX" />
        <meta property="og:description" content="Have a question about AlifallX? Get in touch with Yana Krukovets." />
        <meta property="og:image" content="https://www.alifallx.com/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact — AlifallX" />
        <meta name="twitter:description" content="Have a question about AlifallX? Get in touch with Yana Krukovets." />
        <meta name="twitter:image" content="https://www.alifallx.com/images/og-image.png" />
      </Head>

      <div className="contact-page">
        <div className="contact-page__inner">
          <div className="contact-page__left">
            <p className="contact-page__label">Get in touch</p>
            <h1 className="contact-page__heading">Have a question?</h1>
            <p className="contact-page__body">
              Whether you found a bug, have feedback about the game, or just
              want to say hi — I&apos;d love to hear from you. Fill out the
              form and I&apos;ll get back to you as soon as I can.
            </p>
            <div className="contact-page__links">
              <Link href="/" className="contact-page__back-link">
                <span aria-hidden="true">← </span>Back to home
              </Link>
            </div>
          </div>

          <div className="contact-page__right">
            {state.succeeded ? (
              <p className="succeed-form" role="status">
                Thanks for reaching out — I&apos;ll get back to you soon!
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                method="POST"
                className="contact-page__form"
              >
                <p className="contact-page__required-note">* required fields</p>

                <label htmlFor="cp-name" className="form-label">
                  Name *
                </label>
                <input
                  id="cp-name"
                  type="text"
                  className="form-control"
                  name="name"
                  aria-required="true"
                  required
                />
                <ValidationError prefix="name" field="name" errors={state.errors} />

                <label htmlFor="cp-email" className="form-label">
                  Email *
                </label>
                <input
                  id="cp-email"
                  type="email"
                  name="email"
                  className="form-control"
                  aria-required="true"
                  required
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />

                <label htmlFor="cp-message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control contact-page__textarea"
                  id="cp-message"
                  name="message"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />

                <button
                  type="submit"
                  className="btn contact-page__submit"
                  disabled={state.submitting}
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
