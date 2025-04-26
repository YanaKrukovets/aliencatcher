import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const { locale, asPath } = router;
  const [mobileNavExpanded, setMobileNavExpanded] = useState(false);
  const dropdown = useRef(null);

  const [isReveal, setIsReveal] = useState(true);
  const reveal = () => setIsReveal(!isReveal);
  let nav;

  nav = {
    item1: {
      label:
        "<span className='whitespace-nowrap lg:whitespace-normal text-[20px]'>About the Game</span>",
      aria: "Link About game Alien Catcher — A Cosmic Watercolor Adventure",
      href: "/#aboutgame",
    },
    item2: {
      label:
        "<span className='whitespace-nowrap lg:whitespace-normal text-[20px]'>Game</span>",
      aria: "Link to Yana Krukovets game Alien Catcher — A Cosmic Watercolor Adventure",
      href: "/game",
    },
    item3: {
      label:
        "<span className='whitespace-nowrap lg:whitespace-normal text-[20px]'>About the Author</span>",
      aria: "Link About Yana Krukovets",
      href: "/#about",
    },
    item4: {
      label:
        "<span className='whitespace-nowrap lg:whitespace-normal text-[20px]'>Contact</span>",
      aria: "Link to Contact Yana Krukovets",
      href: "/#contact",
    },
  };

  const loadMenu = () => {
    let menuArr = [];

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
      {/*Header Nav*/}
      <div className="xxxl:px-0 fixed w-full z-10 left-0">
        <nav className="md:flex justify-between topnav mx-auto">
          <div className="flex justify-between max-w-wrapper px-5 mx-auto w-full">
            {/* Logo */}
            <div className="flex justify-between">
              <div className="w-[60px] md:w-[50px] ">
                <Link href="/" passHref>
                  <Image
                    src="/images/logos/logo-en.png"
                    className="w-full max-w-[60px] object-cover my-[15px]"
                    alt="YK - Yana Krukovets logo"
                    priority={true}
                    width={250}
                    height={250}
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Nav */}

            <div className="desktop-nav">
              {!!menu &&
                menu.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        aria-label={item.aria}
                        href={item.href}
                        key={item.label}
                        className={`${
                          router.pathname == "/" + item.href ? "active" : ""
                        } text-white  hover:underline menu-a`}
                      >
                        <span
                          className="!flex flex-col xmd:inline-block"
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
                          aria-label={item.aria}
                          onClick={() =>
                            setMobileNavExpanded(!mobileNavExpanded)
                          }
                        >
                          <span
                            className={`mobile-nav-text ${
                              index === 0
                                ? "max-w-[200px]"
                                : index === 1
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
            </div>

            {/* Language Toggle */}
            <div className="flex-end mt-[-9px]">
              <a
                role="button"
                ref={dropdown}
                id="nav-button"
                aria-label="mobile menu"
                className={`${mobileNavExpanded ? "open" : ""} nav-button`}
                onClick={() => {
                  setMobileNavExpanded(!mobileNavExpanded);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
