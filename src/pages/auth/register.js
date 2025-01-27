import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Main from "@/layout/Main";

const Register = () => {
  // router
  const router = useRouter();
  return (
    <Main displaySidebar={false}>
      <div className=" w-full h-screen flex  flex-col justify-center items-center bg-white dark:bg-gray-800  ">
        <div className=" w-full flex flex-col sm:flex-row justify-center items-center px-4 sm:px-28 space-x-0 sm:space-x-20">
          <div className="w-full sm:w-4/12 ">
            <p className="text-gray-500 dark:text-gray-300  text-2xl sm:text-3xl  font-semibold font-montserrat  mb-10">
              Welcome to FXHEXA!
            </p>

            {/* Next Button */}
            <div
              className="bg-[#f69320] w-full flex  py-3 rounded cursor-pointer mb-3 mt-5"
              onClick={() => {
                router.push("/auth/register-user");
              }}
            >
              <div className="flex-1 w-3/12">
                <Image
                  src={"/user.png"}
                  width={20}
                  height={20}
                  alt="Google"
                  className="object-contain ml-4"
                />
              </div>
              <p className="font-semibold text-sm font-montserrat  w-8/12">
                Sign Up With Email or Phone
              </p>
            </div>

            <div className="flex flex-row justify-evenly items-center space-x-4 my-2">
              <hr className="w-full h-px my-8 bg-gray-200" />
              <p className="text-md font-semibold text-gray-400">or</p>
              <hr className="w-full h-px my-8 bg-gray-200" />
            </div>

            {/* Google button */}
            <div className="bg-gray-200 w-full flex  py-3 rounded cursor-pointer mb-4 ">
              <div className="flex-1 w-3/12">
                <Image
                  src={"/google.png"}
                  width={20}
                  height={20}
                  alt="Google"
                  className="object-contain ml-4"
                />
              </div>
              <p className="font-semibold text-md w-8/12">
                Continue with Google
              </p>
            </div>
            {/* Apple Button */}
            <div className="bg-gray-200 w-full flex  py-3 rounded cursor-pointer mb-4 ">
              <div className="flex-1 w-3/12">
                <Image
                  src={"/apple_logo.png"}
                  width={20}
                  height={20}
                  alt="Google"
                  className="object-contain ml-4"
                />
              </div>
              <p className="font-semibold text-md w-8/12">
                Continue with Apple
              </p>
            </div>

            <div className="flex mb-2 mt-6">
              <p className="  cursor-pointer  font-semibold text-gray-500 ">
                Already have an account?{" "}
                <span
                  className="font-semibold text-md text-[#f69320] hover:text-yellow-400 hover:underline"
                  onClick={() => router.replace("/auth/login")}
                >
                  Log In
                </span>
              </p>
            </div>
            <div className="flex mb-4">
              <p className="  cursor-pointer font-semibold text-gray-500 ">
                Need an entity account?{" "}
                <span className="font-semibold text-md text-[#f69320] hover:text-yellow-400 hover:underline">
                  Sign Up
                </span>
              </p>
            </div>
          </div>
          <div className="w-full sm:w-6/12 flex flex-row justify-center px-0">
            <div className="flex flex-col">
              <img
                src={"/registerPic.png"}
                alt="register pic"
                className="h-96 w-96 object-contain"
              />
              <p className="text-2xl font-semibold w-10/12  self-center text-gray-400  text-center ">
                Sign up to get 100 USDT trading fee rebate!
              </p>
              <p className="text-lg font-medium t text-gray-400 text-center mt-3">
                Follow the registration steps to redeem your rewards and start
                your crypto journey with us!{" "}
                <span className="text-[#f69320]">FAQ</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Register;

export async function getServerSideProps(context) {
  const userToken = context?.req?.cookies.userToken;

  if (userToken != null) {
    return {
      redirect: {
        destination: "/accounts",
        permanent: false, // Set it to true if it's a permanent redirect
      },
    };
  }

  return {
    props: {},
  };
}
