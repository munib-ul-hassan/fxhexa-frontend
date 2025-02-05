import React, { useState, useEffect } from "react";
import Main from "@/layout/Main";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

const Withdraw = () => {
  // state
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // Get the "from" query param

  const [allTransactions, setallTransactions] = useState([]);
  const [allReferralTransactions, setReferralAllTransactions] = useState([]);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const user = useSelector((state) => state.userReducer);
  const [selection, setselection] = useState();
  const [allDeposits, setallDeposits] = useState([]);

  // router
  const router = useRouter();

  // config
  const config = {
    headers: {
      Authorization: user.user.token,
    },
  };

  // GET transactions
  const getAllTransations = async () => {
    try {
      const res = await axios.get(
        `${Environment.BASE_URL}user/request?limit=200&accountref=${subUser?._id}`,
        config
      );

      console.log("res?.data?.data", res.data.data);
      const isArray = Array.isArray(res?.data?.data);
      if (isArray) {
        const withDrawAll = res?.data?.data?.filter(
          (x) => x?.requestType == "withdraw"
        );

        setallTransactions(withDrawAll?.reverse());
      } else {
        setallTransactions([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllReferrals = async () => {
    try {
      const res = await axios.get(
        `${Environment.BASE_URL}user/request?limit=200`,
        config
      );

      console.log("res?.data?.data", res.data.data);
      const isArray = Array.isArray(res?.data?.data);
      if (isArray) {
        const withDrawAll = res?.data?.data?.filter(
          (x) => x?.requestType == "referel"
        );

        setReferralAllTransactions(withDrawAll?.reverse());
      } else {
        setReferralAllTransactions([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // GET Depsoits
  const getAllDeposits = async () => {
    try {
      const res = await axios.get(
        `${Environment.BASE_URL}user/request?limit=200&accountref=${subUser?._id}`,
        config
      );

      const isArray = Array.isArray(res?.data?.data);
      if (isArray) {
        const withDrawAll = res?.data?.data?.filter(
          (x) => x?.requestType == "deposit"
        );
        setallDeposits(withDrawAll?.reverse());
      } else {
        setallDeposits([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(from=="withdraw"){
      setselection(true)
    }else{
      setselection(false)
    }
    if (Object.keys(subUser)?.length == 0) {
      Swal.fire({
        title: "Not Logged In as SubUser",
        text: "Please Login as SubUser to Continue",
        icon: "info",
        confirmButtonText: "Login to Trading Account",
        confirmButtonColor: "#1e69ae",
      }).then((Res) => {
        if (Res.isConfirmed || Res.isDismissed) {
          router.replace("/accounts");
        }
      });
    }
    getAllTransations();
    getAllDeposits();
    getAllReferrals();
  }, []);


  return (
    <div className="px-8 py-4 min-h-screen relative bg-white dark:bg-gray-800">
      {/* Make Selection */}
      <div className="flex justify-center">
        <label class="relative  inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value={selection}
            class="sr-only peer"
            onChange={() => setselection(!selection)}
          />
          <div class="w-11 h-6 bg-[#f69320] peer-focus:outline-none  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-500 dark:text-gray-300">
            {selection ? "Withdraw" : "Deposit"}
          </span>
        </label>
      </div>
      {selection == true ? (
        // All Withdraw
        <>
          <div className="flex flex-row justify-between items-center mb-3 mt-6">
            <h1 className=" text-md text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
              All Withdraw Request
            </h1>
            <button
              onClick={() => router.replace(`/withdraw/create`)}
              className="bg-[#f69320] text-white font-semibold px-4 py-1 rounded-md hover:opacity-90"
            >
              Create Withdraw Request
            </button>
          </div>
          {allTransactions?.length > 0 ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-300 dark:bg-gray-700 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Account Ref
                    </th>
                    <th scope="col" className="px-6 py-3">
                      status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Payment Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions?.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-gray-100 border-b hover:bg-gray-200 dark:hover:bg-gray-700  dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap "
                        >
                          {item?.accountref}
                        </th>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          <span
                            className={` ${
                              item.status == "pending"
                                ? "bg-red-500 "
                                : "bg-green-500"
                            }  py-1 px-2 rounded text-white font-semibold`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          {item?.amount}
                        </td>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          {item.paymentType || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <h6 className="text-sm text-gray-500 dark:text-gray-300 font-semibold leading-none uppercase ">
              No Transactions Found
            </h6>
          )}
        </>
      ) : (
        // All Deposits
        <>
          <div className="flex flex-row justify-between items-center mb-3 mt-6">
            <h1 className=" text-md text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
              All Deposit Request
            </h1>
            <button
              onClick={() => router.replace(`/deposits/create`)}
              className="bg-[#f69320] text-white font-semibold px-4 py-1 rounded-md hover:opacity-90"
            >
              Create Deposit Request
            </button>
          </div>
          {allDeposits?.length > 0 ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-300 dark:bg-gray-700 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Account Ref
                    </th>
                    <th scope="col" className="px-6 py-3">
                      status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      transactionID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allDeposits?.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-gray-100 border-b hover:bg-gray-200 dark:hover:bg-gray-700  dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap "
                        >
                          {item?.accountref}
                        </th>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          <span
                            className={` ${
                              item.status == "pending"
                                ? "bg-red-500 "
                                : "bg-green-500"
                            }  py-1 px-2 rounded text-white font-semibold`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          {item?.amount}
                        </td>
                        <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                          {item.transactionID || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <h6 className="text-sm text-gray-500 dark:text-gray-300 font-semibold leading-none uppercase ">
              No Deposit Requests Found
            </h6>
          )}
        </>
      )}

      <>
        <div className="flex flex-row justify-between items-center mb-3 mt-6">
          <h1 className=" text-md text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
            All Referral Withdraw Request
          </h1>
          <button
            onClick={() => router.replace(`/referral/create`)}
            className="bg-[#f69320] text-white font-semibold px-4 py-1 rounded-md hover:opacity-90"
          >
            Create Withdraw Request
          </button>
        </div>
        {allReferralTransactions?.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-300 dark:bg-gray-700 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {allReferralTransactions?.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className="bg-gray-100 border-b hover:bg-gray-200 dark:hover:bg-gray-700  dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                        <span
                          className={` ${
                            item.status == "pending"
                              ? "bg-red-500 "
                              : "bg-green-500"
                          }  py-1 px-2 rounded text-white font-semibold`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                        {item?.amount}
                      </td>
                      <td className="px-6 py-4 font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
                        {item.paymentType || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h6 className="text-sm text-gray-500 dark:text-gray-300 font-semibold leading-none uppercase ">
            No Transactions Found
          </h6>
        )}
      </>

      {/* <UpdateRequestModal
        data={selectedItem}
        modalVisible={modalVisible}
        onClose={() => {
          setmodalVisible(!modalVisible);
          setselectedItem([]);
        }}
      /> */}
    </div>
  );
};

export default Withdraw;

Withdraw.layout = Main;
