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
      label: "About the Game",
      aria: "Link About game AlifallX: Don't Leave Them Behind",
      href: "/#aboutgame",
    },
    item2: {
      label: "Game",
      aria: "Link to Yana Krukovets game AlifallX: Don't Leave Them Behind",
      href: "/game",
    },
    item3: {
      label: "Contact",
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
    document.body.style.position = mobileNavExpanded ? "fixed" : "relative";
    return () => { document.body.style.position = "relative"; };
  }, [mobileNavExpanded]);

  return (
    <>
      {/*Header Nav*/}
      <div className="xxxl:px-0 fixed w-full z-10 left-0">
        <nav className="md:flex justify-between topnav mx-auto">
          <div className="flex justify-between max-w-wrapper px-5 mx-auto w-full">
            {/* Logo */}
            <div className="flex justify-between">
              <div className="w-[48px] md:w-[40px] ">
                <Link href="/" passHref>
                  <Image
                    src="/images/logos/alien-logo.svg"
                    className="w-full max-w-[48px] object-cover my-[5px]"
                    alt="AlifallX alien logo"
                    priority={true}
                    width={60}
                    height={80}
                    unoptimized
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
                        aria-current={router.asPath === item.href ? "page" : undefined}
                        className={`${
                          router.pathname == "/" + item.href ? "active" : ""
                        } text-white  hover:underline menu-a`}
                      >
                        <span className="!flex flex-col xmd:inline-block whitespace-nowrap lg:whitespace-normal text-[20px]">
                          {item.label}
                        </span>
                      </Link>
                    </div>
                  );
                })}
            </div>

            {/* Mobile Nav */}

            <div
              id="mobile-nav"
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
                            className={`mobile-nav-text whitespace-nowrap lg:whitespace-normal text-[20px] ${
                              index === 0
                                ? "max-w-[200px]"
                                : index === 1
                                ? "xmd:max-w-[240px]"
                                : ""
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Language Toggle */}
            <div className="flex-end mt-[-9px]">
              <button
                type="button"
                ref={dropdown}
                id="nav-button"
                aria-label={mobileNavExpanded ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileNavExpanded}
                aria-controls="mobile-nav"
                className={`${mobileNavExpanded ? "open" : ""} nav-button`}
                onClick={() => {
                  setMobileNavExpanded(!mobileNavExpanded);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
