import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle the scroll event
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true); // Show button after scrolling 300px
    } else {
      setIsVisible(false); // Hide button if scroll position is less than 300px
    }
  };

  // Scroll smoothly to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll to top
    });
  };

  // Set up event listener for scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <button onClick={scrollToTop} className="back-to-top xxl:right-[20px]">
        <FontAwesomeIcon
          className="w-4 inline mt-[-1px]"
          icon={faAngleUp}
          color="#090a0f"
          role="presentation"
        />
      </button>
    )
  );
};

export default BackToTopButton;
