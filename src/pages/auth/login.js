import React, { useState } from "react";
import Main from "@/layout/Main";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "../../utils/axios";
import BaseURL from "../../constants/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, handleEmail } from "../../store/action/cartAction";
import { setCookie } from "cookies-next";
import ScrollToTopButton from "@/utils/ScrollToTopButton";

const Login = () => {
  const dispatch = useDispatch();
  // router
  const router = useRouter();

  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const userData = useSelector((state) => state.userReducer.user);

  const handleChange = (e, property) => {
    setState({ ...state, [property]: e.target.value });
  };

  const _handleLogin = (e) => {
    e.preventDefault();
    let params = {
      email: state.email,
      password: state.password,
      deviceToken: "abcd",
      deviceType: "postman",
    };
    if (state.email === "" || state.password === "") {
      setError("Fill All Fields");
    } else {
      console.log(BaseURL.LOGIN, params)
      setIsLoader(true);
      axios
        .post(BaseURL.LOGIN, params)
        .then((res) => {
          console.log(res)
          setIsLoader(false);
          console.log("LOGIN ===>", res.data);
          if (res.data.status) {
            dispatch(handleUser(res.data.data));

            setCookie("userToken", res.data.data?.token, {
              maxAge: 60 * 60 * 24 * 7,
            });
            router.replace("/accounts");
          } else {
            setError(res.data.message);
          }
        })
        // .catch((err) => {
        //   setIsLoader(false);
        //   console.log(err);
        // });
    }
  };

  const _resendOTP = () => {
    let params = {
      email: state.email,
    };
    axios
      .post(BaseURL.RESEND_CODE, params)
      .then((res) => {
        console.log("RESEND_CODE ==>", res.data);
        dispatch(handleEmail(state.email));
        router.push("/auth/otp");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Main displaySidebar={false}>
      <div className=" w-full h-full flex-col items-center bg-white dark:bg-gray-800 ">
        <div className="bg-[#f69320] flex space-x-2 items-center justify-center py-3 w-full ">
          <Image src={"/lock.png"} alt="Lock Image" width={20} height={20} />
          <p className="text-slate-800 text-xs font-medium font-montserrat">
            URL verification: https://accounts.fxhexa.com
          </p>
        </div>

        <div className=" w-full flex flex-row justify-between gap-x-10  items-center mt-14 px-4 sm:px-44">
          <div className="w-12/12 sm:w-6/12">
            <p className="text-gray-500 dark:text-gray-300 text-3xl font-semibold font-montserrat mb-10 uppercase">
              Log In
            </p>
            <form onSubmit={(e) => _handleLogin(e)}>
              {/* Email Input */}
              <label
                for="success"
                className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
              >
                Email
              </label>
              <input
                type="text"
                id="success"
                className="bg-gray-200 dark:bg-gray-700 border w-full placeholder:text-gray-400 focus_Login h-14 my-3 border-gray-500 text-gray-300 mb-7 placeholder-gray-300  text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-2.5 "
                placeholder="Enter Email"
                value={state.email}
                onChange={(e) => {
                  handleChange(e, "email");
                }}
              />
              <label
                for="success"
                className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
              >
                Password
              </label>
              <input
                type={"password"}
                id="success"
                className="bg-gray-200 dark:bg-gray-700 border w-full focus_Login h-14 my-1 placeholder:text-gray-400 border-gray-500 text-gray-300 mb-7 placeholder-gray-300  text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-2.5 "
                placeholder="Enter Password"
                value={state.password}
                onChange={(e) => {
                  handleChange(e, "password");
                }}
              />
              {error !== "" && (
                <p className="text-sm text-red-600 font-medium mb-2 font-montserrat">
                  {error}
                </p>
              )}
              {error === "First Verify account" && (
                <div
                  className="my-2 flex items-end justify-end"
                  onClick={() => {
                    _resendOTP();
                  }}
                >
                  <p className="bg-[#0a4c88] text-white font-montserrat font-medium text-base px-2 py-1 rounded-md cursor-pointer">
                    Verify Account
                  </p>
                </div>
              )}

              {/* forget password */}
              <p
                onClick={() => router.replace("/auth/forgetPassword")}
                className="text-md dark:text-[#f69320] text-gray-500 underline mb-3 cursor-pointer"
              >
                forget password ?{" "}
              </p>

              {/* Next Button */}
              <button
                onClick={(e) => _handleLogin(e)}
                className="flex w-full rounded bg-[#f69320]  hover:opacity-90 items-center justify-center cursor-pointer py-2"
              >
                {isLoader ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <p className="text-white font-montserrat uppercase font-bold">
                    Login
                  </p>
                )}
              </button>
            </form>

            <div className="flex flex-row justify-evenly items-center space-x-4 my-2">
              <hr className="w-full h-px my-8 bg-gray-200 border-0  " />
              <p className="text-md font-semibold text-gray-400">or</p>
              <hr className="w-full h-px my-8 bg-gray-200 border-0  " />
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

            <div onClick={() => router.replace("/auth/register")}>
              <p className="  w-6/12 cursor-pointer mt-4 pb-10 hover:underline text-[#f69320] hover:text-[#f69320]">
                Create an FX-HEXA Account
              </p>
            </div>
          </div>
          <div className="w-12/12 sm:w-6/12">
            <img src="/crypto.png" className="h-full w-full rounded-md " />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Login;

export async function getServerSideProps(context) {
  const userToken = context?.req?.cookies.userToken;

  // if (userToken != null) {
  //   return {
  //     redirect: {
  //       destination: "/accounts",
  //       permanent: false, // Set it to true if it's a permanent redirect
  //     },
  //   };
  // }

  return {
    props: {},
  };
}
