import React, { useState, useEffect } from "react";
import Main from "@/layout/Main";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const Withdraw = () => {
  // state
  const [allTransactions, setallTransactions] = useState([]);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const user = useSelector((state) => state.userReducer);

  // router
  const router = useRouter();

  // config
  const config = {
    headers: {
      Authorization: user.user.token,
    },
  };

  useEffect(() => {
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
  }, []);

  // GET transactions
  const getAllTransations = async () => {
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
        setallTransactions(withDrawAll?.reverse());
      } else {
        setallTransactions([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTransations();
  }, []);

  return (
    <div className="px-8 py-4 min-h-screen relative bg-[#1a2330]">
      <>
        <div className="flex flex-row justify-between mb-3">
          <h1 className=" text-md text-gray-300 font-bold leading-none uppercase ">
            All Deposit Request
          </h1>
          <button
            onClick={() => router.replace(`/deposits/create`)}
            className="bg-[#f69320] text-white font-semibold px-4 py-1 rounded-md hover:opacity-90"
          >
            Create Deposit Request
          </button>
        </div>
        {allTransactions?.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-200 uppercase bg-gray-500 dark:bg-gray-700 dark:text-gray-400">
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
                {allTransactions?.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className="bg-[#1a2330] border-b hover:bg-gray-800 dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white"
                      >
                        {item?.accountref}
                      </th>
                      <td className="px-6 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white">
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
                      <td className="px-6 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white">
                        {item?.amount}
                      </td>
                      <td className="px-6 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white">
                        {item.transactionID || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h6 className="text-lg text-gray-300 font-semibold leading-none uppercase ">
            No Deposit Requests Found
          </h6>
        )}
      </>
    </div>
  );
};

export default Withdraw;

Withdraw.layout = Main;
