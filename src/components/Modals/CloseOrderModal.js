import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../inputs/InputField";

const CloseOrderModal = ({
  modalVisible,
  onClose,
  handleSubmit,
  setcloseAmount,
  closeAmount,
  title = "Enter Closing Amount",
  buttonName = "Submit",
  isInputField = true,
}) => {
  // router
  const router = useRouter();

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 z-20 w-full h-full bg-[rgba(0,0,0,0.5)]`}
    >
      <div className="flex flex-col relative dark:bg-gray-700 dark:text-white bg-gray-700 px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>
        <h1 className="text-center text-gray-200 text-xl font-extrabold mb-5">
          {title}
        </h1>
        {isInputField && (
          <InputField
            placeholder="0"
            value={closeAmount}
            onChange={setcloseAmount}
            type="number"
          />
        )}
        <div
          onClick={handleSubmit}
          className="bg-[#f69320] mt-10 hover:scale-105 duration-150 text-white text-md font-semibold uppercase px-20 rounded cursor-pointer py-2"
        >
          {buttonName}
        </div>
      </div>
    </div>
  );
};

export default CloseOrderModal;
