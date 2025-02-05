import React, { useState, useEffect } from "react";

import ButtonWithIcon from "@/components/ButtonWithIcon";
import NewAccountModal from "@/components/Modals/NewAccountModal";
import Main from "@/layout/Main";
import Environment from "@/constants/apiEndPoints";
import { useSelector } from "react-redux";
import axios from "axios";
import PasswordModal from "@/components/Modals/PasswordModal";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Accounts = () => {
  // states
  const [accType, setAccType] = useState("real");
  const [newAccModalVisible, setNewAccModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [realAccounts, setrealAccounts] = useState([]);
  const [demoAccounts, setdemoAccounts] = useState([]);
  const userData = useSelector((state) => state.userReducer.user);
  // const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const [activeAccount, setActiveAccount] = useState([]);
  // const [modalCount, setmodalCount] = useState(0);

  //config
  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  // router
  const router = useRouter();

  useEffect(() => {
    // console.log("userData ==>", subUser);
    // if (Object?.keys(userData)?.length == 0 || userData == undefined) {
    //   router.replace(`/auth/login`);
    // }

    // if (Object?.keys(subUser)?.length == 0 && modalCount == 0) {
    //   Swal.fire({
    //     title:
    //       "Please Login with any Trading Account, If you don't have One, Create by clicking Open New Account tab",

    //     icon: "info",
    //     iconColor: "#0a4c88",
    //     confirmButtonColor: "#0a4c88",

    //     customClass: {
    //       title: "account_title_Sweet",
    //     },
    //   });
    //   setmodalCount(1);
    // }

    axios
      .get(`${Environment.BASE_URL}auth/subacc`, config)
      .then((res) => {
        const real = res?.data?.data?.filter((x) => x?.type == "real");
        const demo = res?.data?.data?.filter((y) => y.type == "demo");
        setrealAccounts(real?.reverse());
        setdemoAccounts(demo?.reverse());
      })
      .catch((error) => {
        console.log("e ==>", error);
      });
  }, [accType]);

  // const handle trade
  const _handleTrade = (item) => {
    setPasswordModalVisible(true);
    setActiveAccount(item);
  };

  // _handleDeleteSubAcc
  const _handleDeleteSubAcc = (item) => {
    Swal.fire({
      title: `Are You Sure You want to Delete "${item?.name}"`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#1e69ae",
      cancelButtonText: "cancel",
      showCancelButton: true,
    }).then((swalRes) => {
      if (swalRes?.isConfirmed == true) {
        axios
          .delete(`${Environment.BASE_URL}auth/subacc/${item?._id}`, config)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Trading Account Deleted",
              showConfirmButton: false,

              timer: 1800,
              timerProgressBar: true,
            });
            router.reload();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: error?.response?.data?.message || "SomeThing Went Wrong",
              confirmButtonColor: "#1e69ae",
            });
          });
      }
    });
  };

  return (
    <div className="min-h-screen py-2 px-4 sm:px-10 bg-white dark:bg-gray-800 relative w-full">
      <div className="w-full border shadow pt-5  ">
        <div className="flex flex-row justify-between my-4 px-10">
          <h4 className="text-2xl font-bold text-gray-500 dark:text-gray-300 capitalize">
            My Trading accounts
          </h4>
          <div
            onClick={() => setNewAccModalVisible(true)}
            className="flex flex-row px-4 gap-x-3 py-2 border cursor-pointer  border-gray-400 rounded "
          >
            <p className="flex flex-row justify-center items-center border text-gray-500 dark:text-gray-300 rounded-full w-6 h-6">
              +
            </p>
            <p className="font-semibold text-gray-500 dark:text-gray-300 ">
              Open New Account
            </p>
          </div>
        </div>
        <div className="flex flex-row border-b-2 mb-4 px-10">
          <h6
            onClick={() => setAccType("real")}
            className={`text-lg text-gray-500 dark:text-gray-300 font-semibold font-montserrat px-4 border-[#f69320] pb-5 cursor-pointer duration-150 transition-all ease-in-out ${
              accType == "real" ? "border-b-4" : "border-b-0 hover:border-b-2"
            }`}
          >
            Real
          </h6>
          <h6
            onClick={() => setAccType("demo")}
            className={`text-lg text-gray-500 dark:text-gray-300  font-semibold font-montserrat px-4 border-[#f69320]  pb-5 cursor-pointer duration-150 transition-all ease-in-out ${
              accType == "demo" ? "border-b-4" : "border-b-0 hover:border-b-2"
            }`}
          >
            Demo
          </h6>
        </div>

        <div className="px-3  ">
          {accType == "real" ? (
            <div className="flex flex-col">
              {realAccounts?.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="border flex flex-row   justify-between px-2 py-2 mb-5 rounded"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-row gap-x-4">
                        <div className="bg-[#f69320] text-gray-700 w-fit px-3 rounded uppercase">
                          {item.type}
                        </div>

                        <div className=" text-gray-500 dark:text-gray-300 w-fit px-3 rounded">
                          {item?._id}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                        {item.balance?.toFixed(2)} <span>{item.currency}</span>
                      </p>
                      <p className="text-lg mb-1 font-semibold text-gray-500 dark:text-gray-300">
                        {item.name}
                      </p>
                    </div>

                    <div className="flex flex-row justify-between items-end gap-x-4">
                      <ButtonWithIcon
                        name={"Deposit"}
                        icon={`/downloads.png`}
                        onClick={() => router.replace(`/withdraw/withdraw?from=deposit`)}
                      />
                      <ButtonWithIcon
                        name={"Withdraw"}
                        icon={`/upload.png`}
                        onClick={() => router.replace(`/withdraw/withdraw?from=withdraw`)}
                      />
                      <ButtonWithIcon
                        onClick={() => _handleTrade(item)}
                        name={"Login"}
                        bgColor={"bg-[#f69320]"}
                      />
                      <img
                        onClick={() => {
                          _handleDeleteSubAcc(item);
                        }}
                        src={"/bin.png"}
                        className="w-5 h-5 mb-[15px] cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col">
              {demoAccounts?.map((item, i) => {
                return (
                  <div className="border flex flex-col sm:flex-row justify-between px-8 py-2 mb-5 rounded">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-row gap-x-4">
                        <div className="bg-green-400 text-white w-fit px-3 rounded uppercase">
                          {item?.type}
                        </div>

                        <div className=" text-gray-500 dark:text-gray-300  w-fit px-3 rounded ">
                          {item._id}
                        </div>
                      </div>
                      <p className="text-2xl font-semibold text-gray-500 dark:text-gray-300 ">
                        {item?.balance?.toFixed(2)} <span>{item.currency}</span>
                      </p>
                      <p className="text-2xl font-semibold text-gray-500 dark:text-gray-300 ">
                        {item?.name}
                      </p>
                    </div>

                    <div className="flex flex-row justify-between items-end gap-x-4">
                      <ButtonWithIcon
                        name={"Deposit"}
                        icon={`/downloads.png`}
                        onClick={() => router.replace("/withdraw/withdraw")}
                      />

                      <ButtonWithIcon
                        name={"Login"}
                        bgColor={"bg-[#f69320]"}
                        border={false}
                        onClick={() => _handleTrade(item)}
                      />
                      <img
                        onClick={() => {
                          _handleDeleteSubAcc(item);
                        }}
                        src={"/bin.png"}
                        className="w-5 h-5 mb-[15px] cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* New account modal */}
      <NewAccountModal
        modalVisible={newAccModalVisible}
        setModalVisible={() => setNewAccModalVisible(!newAccModalVisible)}
      />
      {/* Password Modal */}
      <PasswordModal
        modalVisible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(!passwordModalVisible)}
        data={activeAccount}
      />
    </div>
  );
};

export default Accounts;

Accounts.layout = Main;

export async function getServerSideProps(context) {
  const userToken = context?.req?.cookies.userToken;

  if (userToken == null) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false, // Set it to true if it's a permanent redirect
      },
    };
  }

  return {
    props: {},
  };
}
