import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import crypto from "crypto";
import { FiClipboard } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

const BitcoinDetails = ({ bitcoin }) => {
  const [copyStatus, setCopyStatus] = useState(null);
  const ibanHashRef = useRef(null);

  const copyToClipboard = () => {
    const ibanHash = ibanHashRef.current.innerText;
    navigator.clipboard.writeText(ibanHash).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => {
        setCopyStatus(null);
      }, 1500);
    });
  };

  return (
    <>
      {bitcoin.map((bitcoinItem, index) => {
        // Hash IBAN value using SHA-256
        const ibanHash = crypto
          .createHash("sha256")
          .update(bitcoinItem.iban)
          .digest("hex");

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center "
          >
            <h6 className="text-xl font-bold mb-3">BTC Wallet Address </h6>
            <QRCode value={bitcoinItem.iban} size={300} />
            <div className="flex flex-row items-center justify-center ">
              <h6
                ref={ibanHashRef}
                style={{ fontSize: "11px", cursor: "pointer" }}
                className="text-md font-bold mb-3 mt-4"
                onClick={copyToClipboard}
              >
                {ibanHash}
              </h6>
              {copyStatus === "Copied!" ? (
                <FaClipboardCheck className="h-5 w-5 text-green-500" />
              ) : (
                <FiClipboard
                  onClick={copyToClipboard}
                  className="h-5 w-5 text-blue-500 cursor-pointer"
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BitcoinDetails;

// ============================================================

// import React from "react";

// const BitcoinDetails = ({ bitcoin }) => {
//   return (
//     <>
//       {bitcoin.map((bitcoinItem, index) => (
//         <div key={index} className="flex flex-col items-center justify-center ">
//           <h6 className="text-xl font-bold mb-3">BTC Wallet Address </h6>
//           <img alt="QR Code" src={`/qrcode.png`} className="w-80 h-72 " />
//           <h6 className="text-md font-bold mb-3 mt-4">{bitcoinItem.iban}</h6>
//         </div>
//       ))}
//     </>
//   );
// };

// export default BitcoinDetails;
