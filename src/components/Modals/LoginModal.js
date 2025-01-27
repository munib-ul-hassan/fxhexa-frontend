import { useRouter } from "next/router";
import React from "react";

const LoginModal = ({ modalVisible, onClose }) => {
  // router
  const router = useRouter();
  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]`}
    >
      <div className="flex flex-col relative bg-white px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <h1 className="text-center text-3xl font-extrabold ">
            It seems your are not
            <span className="text-blue-600 uppercase"> logged In</span>
          </h1>

          <br />
        </div>
        <div className="flex flex-col items-center  ">
          <h1 className="text-center text-2xl font-extrabold ">
            Please Login to{" "}
            <span className="text-blue-600 uppercase"> Continue</span>
          </h1>
          <div
            onClick={() => {
              onClose;
              router.replace(`/auth/login`);
            }}
            className="bg-[#f69320]  text-white text-md font-semibold uppercase px-20 my-4 rounded cursor-pointer py-2"
          >
            Login
          </div>

          <div className="flex flex-row justify-evenly items-center  w-full space-x-4 my-2">
            <hr className="w-full h-[1px] my-8 bg-gray-200 border-2  " />
            <p className="text-md font-semibold text-gray-400 uppercase">or</p>
            <hr className="w-full h-[1px] my-8 bg-gray-200 border-2  " />
          </div>
          <h1 className="text-center text-2xl font-extrabold  ">
            Didn't have an account
            <span className="text-blue-600 uppercase"> account</span>
            <br />
            Please <span className="text-blue-600 uppercase"> Register</span> to
            Continue
          </h1>
          <div
            onClick={() => {
              onClose;
              router.replace(`/auth/register`);
            }}
            className="bg-[#f69320]  text-white text-md font-semibold uppercase px-20 my-4 rounded cursor-pointer py-2"
          >
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
