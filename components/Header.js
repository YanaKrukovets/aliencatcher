/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import en from "../locales/en";
import fr from "../locales/fr";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { locale, asPath } = router;
  const [mobileNavExpanded, setMobileNavExpanded] = useState(false);
  const dropdown = useRef(null);
  const [isSubmenu, setIsSubmenu] = useState(false);
  const t = locale === "en" ? en : fr;
  const subMenu = useRef(null);
  const [isReveal, setIsReveal] = useState(true);
  const reveal = () => setIsReveal(!isReveal);
  let nav;

  if (locale === "en") {
    nav = {
      item1: {
        img: "/images/icons/artworks-icon.png",
        alt: "artwork icon",
        label:
          "<span class='whitespace-nowrap lg:whitespace-normal md:font-[500]'>Artworks</span>",
        href: "/artworks",
      },
      item2: {
        img: "/images/icons/artist-icon.png",
        alt: "author icon",
        label:
          "<span class='whitespace-nowrap lg:whitespace-normal md:font-[500]'>About the artist</span>",
        href: "/about",
      },
      item3: {
        img: "/images/icons/contact-icon.png",
        alt: "contact icon",
        label:
          "<span class='whitespace-nowrap lg:whitespace-normal md:font-[500]'>Contact</span>",
        href: "/contact",
      },
    };
  } else {
    nav = {
      item1: {
        label:
          "<span class='whitespace-nowrap lg:whitespace-normal'>link1</span>",
        href: "books",
      },
      item2: {
        label:
          "<span class='whitespace-nowrap lg:whitespace-normal'>link4</span>",
        href: "link4",
      },
      item3: {
        label: "link5",
        href: "link5",
      },
    };
  }

  const loadMenu = () => {
    let menuArr = [];
    //if (isMbl) [nav["item1"], nav["item2"]] = [nav["item2"], nav["item1"]];
    for (const key in nav) {
      let temp = nav[key];
      menuArr.push(temp);
    }
    return menuArr;
  };
  const menu = loadMenu();

  // disable scrolling on mobile nav menu
  useEffect(() => {
    if (mobileNavExpanded) {
      document.body.style.position = "fixed";
      function handleClick(event) {}
      window.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("click", handleClick);
        document.body.style.position = "relative";
      };
    }
    return () => (document.body.style.position = "relative");
  }, [mobileNavExpanded]);

  return (
    <>
      <header className="fixed top-0 w-full bg-[#ffffff]">
        {/*Header Nav*/}
        <nav className="max-w-inner md:flex justify-between !xxx:px-0">
          <div className="logo text-grey flex justify-between max-w-wrapper px-5 sm:px-2 mx-auto w-full mb-3">
            {/* Logo */}
            <div className="logo flex justify-between">
              <div className="w-[331px] mdlg:w-[200px] md:w-[185px]">
                <Link href="/" passHref>
                  <Image
                    src={t.header.nav_logo_src}
                    className="w-full max-w-[250px] mt-[10px] object-cover"
                    alt={t.header.nav_logo_alt}
                    priority={true}
                    width={250}
                    height={250}
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Nav */}

            <div
              className={`desktop-nav ${
                locale == "en" ? "" : "desktop-nav-fr"
              }`}
            >
              {!!menu &&
                menu.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        href={item.href}
                        key={item.label}
                        className={`${
                          router.pathname == "/" + item.href ? "active" : ""
                        } desktop-nav-item transition-all hover:underline`}
                      >
                        <Image
                          className={`desktop-nav-icon object-cover`}
                          src={item.img}
                          alt={item.alt}
                          width={250}
                          height={250}
                          priority={true}
                        />
                        <span
                          className={`desktop-nav-text ${
                            locale === "en"
                              ? "!flex flex-col xmd:inline-block"
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{ __html: item.label }}
                        ></span>
                      </Link>
                    </div>
                  );
                })}
            </div>

            {/* Mobile Nav */}

            <div
              className={`mobile-nav ${
                mobileNavExpanded ? "block h-full" : ""
              }`}
            >
              {!!menu &&
                menu.map((item, index) => {
                  return (
                    <div key={index}>
                      {item.submenu ? (
                        <></>
                      ) : (
                        <Link
                          href={item.href}
                          className="mobile-nav-item"
                          onClick={() =>
                            setMobileNavExpanded(!mobileNavExpanded)
                          }
                        >
                          <span
                            className={`mobile-nav-text ${
                              index === 0
                                ? "max-w-[200px]"
                                : index === 1 && locale === "en"
                                ? "xmd:max-w-[240px]"
                                : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: item.label }}
                          ></span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              {/*<NavLangToggle />*/}
            </div>

            {/* Language Toggle */}
            <div className="flex-end">
              {/*  <div
                className={`xmd:hidden px-3 xxmd:pl-0 items-center text-grey text-center`}
              >
                <NavLangToggle />
              </div>*/}

              <a
                role="button"
                ref={dropdown}
                id="nav-button"
                aria-label="mobile menu"
                className={`${mobileNavExpanded ? "open" : ""} nav-button`}
                onClick={() => {
                  setMobileNavExpanded(!mobileNavExpanded);
                  setIsSubmenu(false);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
