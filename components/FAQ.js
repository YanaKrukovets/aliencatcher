import React, { useState } from "react";

const faqs = [
  {
    q: "Is AlifallX free to play?",
    a: "Yes — AlifallX is completely free to play in your browser. No download, account, or payment needed.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. AlifallX has full touch controls with on-screen buttons for moving, shooting, and activating your shield. It works on phones and tablets.",
  },
  {
    q: "Do I need to create an account to play?",
    a: "No account required. Just open the game page and start playing instantly.",
  },
  {
    q: "How do I get more lives, bullets, or shields?",
    a: "Earn coins by catching aliens and shooting rocks, then spend them in-game: press 1 for 30 bullets (100 coins), 2 for a shield (70 coins), or 3 for an extra life (200 coins).",
  },
  {
    q: "What are the controls?",
    a: "Keyboard: ← → or A/D to move, Space to shoot, S to activate shield. On mobile, use the on-screen touch buttons.",
  },
  {
    q: "Is there multiplayer?",
    a: "Multiplayer is coming soon — stay tuned!",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section id="faq" className="faq-section">
      <div className="faq-inner">
        <h2 className="section-heading-blue faq-heading">Frequently Asked Questions</h2>
        <dl className="faq-list">
          {faqs.map((item, index) => (
            <div key={index} className={`faq-item${openIndex === index ? " faq-item--open" : ""}`}>
              <dt>
                <button
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={openIndex === index}
                >
                  {item.q}
                  <span className="faq-icon" aria-hidden="true">{openIndex === index ? "−" : "+"}</span>
                </button>
              </dt>
              <dd className="faq-answer">
                <p>{item.a}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQ;
