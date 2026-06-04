import { useForm, ValidationError } from "@formspree/react";

function ContactForm() {
  const [state, handleSubmit] = useForm("mjvllaww");

  if (state.succeeded) {
    return (
      <p className="succeed-form" role="status" aria-live="polite" aria-atomic="true">
        Thanks for taking the time to reach out. I will contact with you soon
      </p>
    );
  }

  return (
    <section id="contact" className="contact-section py-[40px] font-roboto">
      <div className="max-w-wrapper px-5 mx-auto  py-[20px] ">
        <h2 className="section-heading-cyan pb-[10px] text-[27px] max-w-[900px] mx-auto">
          <b>Have a question?</b>
        </h2>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="max-w-[900px] mx-auto"
        >
            <p>* - required fields</p>
            <label htmlFor="name" className="form-label">
              Name:*
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              name="name"
              aria-required="true"
              required
            />
            <ValidationError prefix="name" field="name" errors={state.errors} />

            <label htmlFor="email" className="form-label">
              Email:*
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              aria-required="true"
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />

            <label htmlFor="message" className="form-label">
              Message:
            </label>
            <textarea className="form-control" id="message" name="message" />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
            <button type="submit" className="btn" disabled={state.submitting}>
              Submit
            </button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
