import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import crypto from "crypto";
import { FiClipboard } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

const UsdtDetail = ({ usdt }) => {
  const [copyStatus, setCopyStatus] = useState(null);
  const usdtHashRef = useRef(null);

  const copyToClipboard = () => {
    const usdtHash = usdtHashRef.current.innerText;
    navigator.clipboard.writeText(usdtHash).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => {
        setCopyStatus(null);
      }, 1500);
    });
  };

  return (
    <>
      {usdt.map((usdtItem, index) => {
        // Hash IBAN value using SHA-256
        const usdtHash = crypto
          .createHash("sha256")
          .update(usdtItem.iban)
          .digest("hex");

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center "
          >
            <h6 className="text-xl font-bold mb-3">USDT Address </h6>
            <QRCode value={usdtItem.iban} size={300} />
            <div className="flex flex-row items-center justify-center ">
              <h6
                ref={usdtHashRef}
                style={{ fontSize: "11px", cursor: "pointer" }}
                className="text-md font-bold mb-3 mt-4"
                onClick={copyToClipboard}
              >
                {usdtHash}
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

export default UsdtDetail;

// import React from "react";

// const UsdtDetail = ({ usdt }) => {

//   return (
//     <>
//       {usdt.map((usdtItem, index) => (
//         <div className="flex flex-col items-center justify-center ">
//           <h6 className="text-xl font-bold mb-3">USDT Address </h6>
//           <img alt="QR Code" src={`/USDT.jfif`} className="w-80 h-72 " />
//           <h6 className="text-md font-bold mb-3 mt-4">{usdtItem?.iban} </h6>
//         </div>
//       ))}
//     </>
//   );
// };

// export default UsdtDetail;
