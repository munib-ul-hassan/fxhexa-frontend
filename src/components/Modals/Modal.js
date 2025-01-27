import Image from "next/image";
import Link from "next/link";
import React from "react";

function Modal({ modalVisible, onClose }) {
  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]`}
      onClick={onClose}
    >
      <div className="flex flex-row relative bg-white px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div>
          <Image src={"/warning.png"} width={50} height={50} />
          <p className="text-lg text-black font-semibold font-montserrat">
            MetaMask not found.
          </p>
          <p className="text-base text-black font-medium mt-2 mb-4 font-montserrat">
            Please install MetaMask extension.
          </p>
          <Link
            href={"https://metamask.io/download/"}
            className="text-base text-black font-montserrat font-medium hover:underline hover:text-red-500"
          >
            Click here to Download Metamask:
          </Link>
        </div>
        <Image
          src={"/MetaMask.png"}
          width={100}
          height={100}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export default Modal;
