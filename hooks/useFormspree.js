import { useState } from "react";

export function useForm(formId) {
  const [state, setState] = useState({
    submitting: false,
    succeeded: false,
    errors: [],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setState((prev) => ({ ...prev, submitting: true, errors: [] }));

    const data = Object.fromEntries(new FormData(event.target));

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();

      if (response.ok) {
        setState({ submitting: false, succeeded: true, errors: [] });
      } else {
        setState({ submitting: false, succeeded: false, errors: json.errors ?? [] });
      }
    } catch {
      setState({ submitting: false, succeeded: false, errors: [{ message: "Network error — please try again." }] });
    }
  }

  return [state, handleSubmit];
}

export function ValidationError({ errors, field }) {
  const fieldErrors = errors?.filter((e) => e.field === field || (!e.field && field === "message"));
  if (!fieldErrors?.length) return null;
  return (
    <ul className="form-errors" role="alert">
      {fieldErrors.map((e, i) => (
        <li key={i} className="form-error-text">{e.message}</li>
      ))}
    </ul>
  );
}
