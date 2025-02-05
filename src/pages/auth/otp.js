import React, { useState } from "react";
import Main from "@/layout/Main";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "../../utils/axios";
import BaseURL from "../../constants/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { handleUser } from "../../store/action/cartAction";

const Login = () => {
  const dispatch = useDispatch();
  // router
  const router = useRouter();

  const [state, setState] = useState({
    otp: "",
  });
  const [error, setError] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const handleChange = (e, property) => {
    setState({ ...state, [property]: e.target.value });
  };

  const userEmail = useSelector((state) => state.userReducer.email);
  console.log("userEmail ==>", userEmail);

  const _handleVerifyAccount = () => {
    let params = {
      email: userEmail,
      otp: state.otp,
      deviceToken: "1234567890",
      deviceType: "ios",
    };
    if (state.otp === "") {
      setError("Enter OTP");
    } else {
      setIsLoader(true);
      axios
        .post(BaseURL.VERIFY_USER, params)
        .then((res) => {
          setIsLoader(false);
          console.log("VERIFY_USER ===>", res.data);
          if (res.data.status) {
            axios
              .get(BaseURL.GET_PROFILE, {
                headers: {
                  authorization: res.data.data.token,
                },
              })
              .then((res) => {
                console.log("GET_PROFILE ===>", res.data);
                dispatch(handleUser(res.data.data));
                router.replace("/auth/login");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setError(res.data.message);
          }
        })
        .catch((err) => {
          setIsLoader(false);
          console.log(err);
        });
    }
  };

  return (
    <Main displaySidebar={false}>
      <div className=" w-full h-screen bg-white dark:bg-gray-800 flex-col items-center ">
        <div className="bg-[#f69320] flex space-x-2 items-center justify-center py-3 w-full ">
          <Image src={"/lock.png"} alt="Lock Image" width={20} height={20} />
          <p className="text-slate-800 text-xs font-medium font-montserrat">
            URL verification: https://accounts.vinzex.com
          </p>
        </div>

        <div className=" w-full flex  justify-center items-center mt-14 px-4 sm:px-44">
          <div className="w-12/12 sm:w-6/12">
            <p className="text-gray-500 dark:text-gray-300 text-3xl font-semibold font-montserrat mb-10 uppercase">
              OTP
            </p>

            {/* Email Input */}
            <label
              for="success"
              className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
            >
              OTP
            </label>
            <input
              type="text"
              id="success"
              className="bg-gray-100 dark:bg-gray-700 border w-full focus_Login h-14 my-3 border-gray-200 text-gray-400 mb-7 placeholder:text-gray-400  text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-2.5 "
              placeholder="Enter OTP"
              value={state.email}
              onChange={(e) => {
                handleChange(e, "otp");
              }}
            />

            {error !== "" && (
              <p className="text-sm text-red-600 font-medium mb-2 font-montserrat">
                {error}
              </p>
            )}

            {/* Next Button */}
            <div
              onClick={() => _handleVerifyAccount()}
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
                  Verify Account
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Login;
