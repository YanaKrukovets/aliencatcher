import AboutGame from "../components/AboutGame";
import Head from "next/head";

import ContactForm from "../components/Contact";
import FAQ from "../components/FAQ";
import HeaderBanner from "../components/HomeBanner";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>AlifallX: Don&apos;t Leave Them Behind — Browser Game by Yana Krukovets</title>
        <meta
          name="description"
          content="AlifallX: Don't Leave Them Behind. Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets. Ottawa, Canada."
        />
        <link rel="canonical" href="https://www.alifallx.com/" />
        <meta property="og:url" content="https://www.alifallx.com/" />
        <meta property="og:title" content="AlifallX: Don't Leave Them Behind — Browser Game by Yana Krukovets" />
        <meta
          property="og:description"
          content="Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.alifallx.com/images/og-image.png" />
        <meta property="twitter:url" content="https://www.alifallx.com/" />
        <meta name="twitter:title" content="AlifallX: Don't Leave Them Behind — Browser Game by Yana Krukovets" />
        <meta
          name="twitter:description"
          content="Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Yana Krukovets",
              "url": "https://www.alifallx.com",
              "jobTitle": "Game Developer",
              "description": "Creator of AlifallX: Don't Leave Them Behind, a free arcade browser game.",
              "address": { "@type": "PostalAddress", "addressLocality": "Ottawa", "addressCountry": "CA" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Is AlifallX free to play?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — AlifallX is completely free to play in your browser. No download, account, or payment needed." } },
                { "@type": "Question", "name": "Does it work on mobile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. AlifallX has full touch controls with on-screen buttons for moving, shooting, and activating your shield. It works on phones and tablets." } },
                { "@type": "Question", "name": "Do I need to create an account to play?", "acceptedAnswer": { "@type": "Answer", "text": "No account required. Just open the game page and start playing instantly." } },
                { "@type": "Question", "name": "How do I get more lives, bullets, or shields?", "acceptedAnswer": { "@type": "Answer", "text": "Earn coins by catching aliens and shooting rocks, then spend them in-game: press 1 for 30 bullets (100 coins), 2 for a shield (70 coins), or 3 for an extra life (200 coins)." } },
                { "@type": "Question", "name": "What are the controls?", "acceptedAnswer": { "@type": "Answer", "text": "Keyboard: ← → or A/D to move, Space to shoot, S to activate shield. On mobile, use the on-screen touch buttons." } },
                { "@type": "Question", "name": "Is there multiplayer?", "acceptedAnswer": { "@type": "Answer", "text": "Multiplayer is coming soon — stay tuned!" } },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              "name": "AlifallX: Don't Leave Them Behind",
              "url": "https://www.alifallx.com/game",
              "description": "Free arcade browser game where you pilot a spaceship to rescue falling aliens, dodge rocks, fight UFOs, and survive increasingly wild levels.",
              "genre": ["Arcade", "Action"],
              "operatingSystem": "Web Browser",
              "applicationCategory": "Game",
              "isFamilyFriendly": true,
              "author": { "@type": "Person", "name": "Yana Krukovets" },
            }),
          }}
        />
      </Head>
      <div className="headerbanner">
        <HeaderBanner />
      </div>
      <div className="bg-white">
        <AboutGame />
      </div>
      <FAQ />
      <div className="contact-wrapper">
        <ContactForm />
      </div>
    </>
  );
}
