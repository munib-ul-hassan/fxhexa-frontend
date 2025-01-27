import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout, subUserLogout } from "@/store/action/cartAction";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import Swal from "sweetalert2";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Accountsbar = ({ setaccountSidebarOpen, accountSidebarOpen }) => {
  // state
  const user = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);

  const dispatch = useDispatch();

  // router
  const router = useRouter();

  // handle referral
  const _handleCopyReferral = () => {
    navigator.clipboard
      .writeText(
        `https://fx-web-82cccad64386.herokuapp.com/auth/register-user?referralcode=${user?.user?.refereCode}`
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Referral Link Copied",
          text: "Feel free to share this Referral with others",
          timer: 4000,
          timerProgressBar: true,
        }).then(() => {
          setaccountSidebarOpen();
        });
      });
  };

  return (
    <div
      onClick={setaccountSidebarOpen}
      className={`h-full w-full inset-0 fixed bg-[rgba(0,0,0,0.5)] ${
        accountSidebarOpen ? " " : " translate-x-full"
      }  transition-transform`}
    >
      <div className="w-full h-full relative ">
        <div className="absolute top-2 left-[-2.5rem] ">
          <img
            className=" cursor-pointer h-10 w-10 p-2 bg-[#f69320]"
            src={"/menu.png"}
          />
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed right-0 h-full p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800 w-80 "
        >
          {Object.keys(user?.user)?.length > 0 ? (
            <>
              <button
                onClick={setaccountSidebarOpen}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close menu</span>
              </button>
              <p className="text-base font-bold text-gray-400  font-montserrat pt-4 px-5">
                {user?.user?.email}
              </p>
              <div
                onClick={() => router.replace(`/forex/AUD-JPY`)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 mt-4 border-b-2 border-[#f69320] flex flex-row items-center  cursor-pointer"
              >
                <Image
                  src={"/dashboard.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Home
                </p>
              </div>
              <div
                onClick={() => {
                  router.replace("/accounts");
                  setaccountSidebarOpen();
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 border-b-2 border-[#f69320] flex flex-row items-center cursor-pointer"
              >
                <Image
                  src={"/accounts.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  My Accounts
                </p>
              </div>
              {/* <div
                onClick={() => _handleCopyReferral()}
                className="bg-[#0a4c88] p-3 border-b-2 border-[#f69320] flex flex-row items-center hover:bg-[#1e69ae] cursor-pointer"
              >
                <Image
                  src={"/copy.png"}
                  width={20}
                  height={20}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-sm text-[#f69320] font-semibold font-montserrat ml-3 capitalize">
                  Copy referral Link
                </p>
              </div> */}
              {/* <div
                onClick={() => _handleCopyReferral()}
                className="bg-[#0a4c88] p-3 border-b-2 border-[#f69320] flex flex-row items-center hover:bg-[#1e69ae] cursor-pointer"
              >
                <Image
                  src={"/copy.png"}
                  width={20}
                  height={20}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-sm text-[#f69320] font-semibold font-montserrat ml-3 capitalize">
                  Copy referral Link
                </p>
              </div> */}
              <div
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 border-b-2 border-[#f69320] flex flex-row items-center cursor-pointer"
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace("/transaction/alltransactions");
                }}
              >
                <Image
                  src={"/transactions.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Trade History
                </p>
              </div>
              <div
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 border-b-2 border-[#f69320] flex flex-row items-center cursor-pointer"
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace("/withdraw/withdraw");
                }}
              >
                <Image
                  src={"/transactions.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Transactions History
                </p>
              </div>
              {/* <div
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace("/withdraw/withdraw");
                }}
                className="bg-[#0a4c88] p-3 border-b-2 border-[#f69320] flex flex-row items-center hover:bg-[#1e69ae] cursor-pointer"
              >
                <Image
                  src={"/withdraw.png"}
                  width={20}
                  height={20}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-sm text-[#f69320] font-semibold font-montserrat ml-3">
                  Withdraw
                </p>
              </div> */}
              {/* <div
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace('/withdraw/withdraw');
                }}
                className="bg-[#0a4c88] p-3 border-b-2 border-[#f69320] flex flex-row items-center hover:bg-[#1e69ae] cursor-pointer"
              >
                <Image
                  src={"/deposit.png"}
                  width={20}
                  height={20}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-sm text-[#f69320] font-semibold font-montserrat ml-3">
                  Deposit
                </p>
              </div> */}
              <div
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace("/referral");
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 border-b-2 border-[#f69320] flex flex-row items-center  cursor-pointer"
              >
                <Image
                  src={"/referral.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Referral
                </p>
              </div>
              <div
                onClick={() => {
                  setaccountSidebarOpen();
                  router.replace("/profile");
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 border-b-2 border-[#f69320] flex flex-row items-center  cursor-pointer"
              >
                <Image
                  src={"/user_yellow.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Proflie
                </p>
              </div>

              <div
                onClick={() => {
                  deleteCookie("userToken");
                  dispatch(logout());
                  dispatch(subUserLogout());
                  router.replace("/auth/login");
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 flex flex-row items-center  cursor-pointer"
              >
                <Image
                  src={"/logout.png"}
                  width={16}
                  height={16}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xs text-[#f69320] font-semibold font-montserrat ml-3">
                  Logout
                </p>
              </div>
              {subUser != null &&
              subUser != undefined &&
              Object?.keys(subUser)?.length > 0 ? (
                <div className="w-full   mt-4 rounded-lg">
                  <div className="flex flex-col bg-gray-200  dark:bg-gray-800 ">
                    <div className="flex pl-3 ">
                      <Image
                        src={"/secure.png"}
                        width={16}
                        height={16}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                      <p className="text-[#f69320]  text-xs font-semibold capitalize p-3 ">
                        Trading Account
                      </p>
                    </div>

                    <p className="text-[#f69320] text-sm font-semibold capitalize p-2 pt-0 border-b-2 border-[#f69320]">
                      {subUser?.name} ({subUser?.type})
                    </p>
                    <p className="text-[#f69320] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold capitalize p-2 border-b-2 border-[#f69320]">
                      Balance: {subUser?.balance?.toFixed(2)}{" "}
                      {subUser?.currency}
                    </p>
                    <p className="text-[#f69320]  hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold capitalize p-2 border-b-2 border-[#f69320]">
                      Updated At: {subUser?.updatedAt?.slice(0, 10)}
                    </p>
                    <p
                      onClick={() => {
                        dispatch(subUserLogout());
                        Swal.fire({
                          icon: "success",
                          title: "Logged Out as SubUser",
                          showConfirmButton: false,

                          timer: 1800,
                          timerProgressBar: true,
                        });
                      }}
                      className="text-[#f69320] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold p-2 capitalize cursor-pointer"
                    >
                      logout
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => router.replace("/accounts")}
                  className="w-full  bg-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 mt-4 rounded-lg"
                >
                  <div className="flex flex-col w-full py-2 px-1 text-center text-[#f69320] font-semibold cursor-pointer hover:scale-105 duration-150">
                    Login With Trading Account
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <div
                  onClick={() => router.replace(`/forex/AUD-JPY`)}
                  className="w-full   cursor-pointer p-2"
                >
                  <img src={"/logoNew.png"} className="h-full  w-full" />
                </div>

                <div className="flex flex-col justify-center text-center mt-10 space-y-4">
                  <p
                    onClick={() => router.replace("/auth/login")}
                    className="text-black text-sm mr-5 font-montserrat font-medium bg-[#f69320] p-1 sm:p-2 rounded-lg cursor-pointer"
                  >
                    Login
                  </p>
                  <p className="text-gray-400 font-bold text-lg uppercase">
                    or
                  </p>
                  <p
                    onClick={() => router.replace("/auth/register-user")}
                    className="text-black text-sm mr-5 font-montserrat font-medium bg-[#f69320] p-1 sm:p-2 rounded-lg cursor-pointer"
                  >
                    Register
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accountsbar;
