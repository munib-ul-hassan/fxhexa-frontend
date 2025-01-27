import React from "react";

const Footer = () => {
  return (
    <footer className="flex items-center bg-[#1a2330] justify-center py-8 border-t-[1px]">
      <p className="font-normal font-montserrat text-[#f69320]">
        © {new Date().getFullYear()} Your FX HEXA. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
