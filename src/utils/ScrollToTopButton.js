import Image from "next/image";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <Image alt="scroll-top" src={"/arrow.png"} width={15} height={15} />
        </button>
      )}

      <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgb(255, 255, 255);
          color: #fff;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s;
          box-shadow: rgba(58, 63, 71, 0.3) 0px 1px 15px;
        }

        .scroll-to-top:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default ScrollToTopButton;
