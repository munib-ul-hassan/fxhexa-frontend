import Modal from "@/components/Modals/Modal";
import UpdateRequestModal from "@/components/Modals/UpdateRequestModal";
import TransactionsModal from "@/components/TransactionsModal";
import Environment from "@/constants/apiEndPoints";
import Main from "@/layout/Main";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import TransactionsTable from "../../components/TransactionsTable";
import Swal from "sweetalert2";
import PageLoader from "@/components/PageChange";

const Alldeposits = () => {
  // date
  const date = new Date();

  // states
  const state = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state.subUserReducer.subUser);
  const [allTranations, setallTranations] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [selectedItem, setselectedItem] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState(date.toISOString()?.slice(0, 10));
  const [loading, setloading] = useState(false);
  const [closeAllTransactions, setcloseAllTransactions] = useState([]);
  const [pendingAllTransactions, setpendingAllTransactions] = useState([]);

  // router
  const router = useRouter();

  const config = {
    headers: {
      Authorization: state?.user?.token || state.admin?.data?.token,
    },
  };

  const getAllTransations = async () => {
    try {
      const response = await axios.get(
        `${Environment.BASE_URL}order/getOrder?limit=200&subAccId=${subUser?._id}`,
        config
      );
        console.log("res ==>", response.data?.data);
        // setallTranations(response.data?.data?.reverse());
      setpendingAllTransactions(response.data?.data?.pending);
      setcloseAllTransactions(response.data?.data?.close);
      setallTranations(response.data?.data?.open);
    } catch (err) {
      console.log("err ==>", err);
    }
  };

  useEffect(() => {
    getAllTransations();
  }, []);

  const searchTransactions = () => {
    if (startDate == "" || endDate == "" || startDate > endDate) {
      if (startDate > endDate) {
        Swal.fire({
          icon: "error",
          title: "End Date Must be greater than Start Date ",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Please Enter Valid Date",
        });
      }
    } else {
      setloading(true);
      axios
        .get(
          `${Environment.BASE_URL}order/getOrder?page=1&limit=30&subAccId=${subUser?._id}&from=${startDate}&to=${endDate}`,
          config
        )
        .then((res) => {
          setallTranations(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="px-8 py-4 min-h-screen relative bg-white dark:bg-gray-800">
      <div className="flex flex-row justify-between items-center mb-3">
        <h1 className=" text-xl text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
          All History
        </h1>

        <div className=" flex flex-row items-center gap-x-2">
          <label className="text-xs text-gray-500 dark:text-gray-300 font-montserrat">
            Start Date:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setstartDate(e.target.value)}
            class="block w-full p-1  text-sm text-gray-500 border border-gray-300 rounded bg-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />
          <label className="text-xs text-gray-500 dark:text-gray-300 font-montserrat">
            End Date:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setendDate(e.target.value)}
            class="block w-full p-1  text-sm text-gray-500 border border-gray-300 rounded bg-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />

          <button
            onClick={() => searchTransactions()}
            className=" cursor-pointer hover:scale-105 duration-150 ml-5 border rounded-sm border-[#f69320] px-3 py-0"
          >
            <img src={"/search.png"} className="w-8 h-8 object-contain" />
          </button>
          <button
            onClick={() => {
              new Promise((res, rej) => {
                setloading(true);
                getAllTransations()
                  .then(() => {
                    setstartDate("");
                    res();
                  })
                  .catch((error) => {
                    rej(error);
                  });
              })
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                  setloading(false);
                });
            }}
            className=" cursor-pointer hover:scale-105 duration-150 ml-5 border rounded-sm text-[#f69320] border-[#f69320] px-3 py-1"
          >
            Reset
          </button>
        </div>
        <div></div>
      </div>
      <h1 className="py-4 text-xl text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
          Open Transactions History
        </h1>
      <div className="relative overflow-x-auto mt-0  ">
        {allTranations?.length > 0 ? (
          <table className="w-full text-gray-500 dark:text-gray-300 relative text-sm text-left bg-gray-100 dark:bg-gray-800 ">
            <thead className="text-xs text-gray-500 dark:text-gray-300  sticky -top-4 z-0 uppercase bg-gray-300 dark:bg-gray-900 ">
              <tr>
                <th scope="col" className="px-3 py-1">
                  ID
                </th>
                <th scope="col" className="px-3 py-1">
                  type
                </th>
                <th scope="col" className="px-3 py-1">
                  Element
                </th>
                <th scope="col" className="px-3 py-1">
                  Unit
                </th>
                <th scope="col" className="px-3 py-1">
                  status
                </th>
                <th scope="col" className="px-3 py-1">
                  request type
                </th>
                <th scope="col" className="px-3 py-1">
                  open Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {allTranations?.map((item, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-gray-100  dark:hover:bg-gray-800 hover:bg-gray-200 border-b  dark:bg-gray-700 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item._id?.slice(0, 6)}
                    </th>
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item.type}
                    </th>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.type == "Stock"
                        ? item?.stock
                        : item?.from + "➞" + item?.to}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.unit}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      <span
                        className={` ${
                          item.status == "pending" || item.status == "close"
                            ? "bg-red-500 "
                            : "bg-green-500"
                        }  py-0 px-2 rounded text-white font-semibold`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.orderType}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.openAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h6 className="my-6 bg-[#f69320] px-2 text-md font-semibold uppercase text-gray-500 dark:text-gray-300 text-center">
            No Open records found!
          </h6>
        )}
      </div>

      {/* CLOSE Transactions  */}
      <h1 className="py-4 text-xl text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
          Close Transactions History
        </h1>
      <div className="relative overflow-x-auto mt-0  ">
        {closeAllTransactions?.length > 0 ? (
          <table className="w-full text-gray-500 dark:text-gray-300 relative text-sm text-left bg-gray-100 dark:bg-gray-800 ">
            <thead className="text-xs text-gray-500 dark:text-gray-300  sticky -top-4 z-0 uppercase bg-gray-300 dark:bg-gray-900 ">
              <tr>
                <th scope="col" className="px-3 py-1">
                  ID
                </th>
                <th scope="col" className="px-3 py-1">
                  type
                </th>
                <th scope="col" className="px-3 py-1">
                  Element
                </th>
                <th scope="col" className="px-3 py-1">
                  Unit
                </th>
                <th scope="col" className="px-3 py-1">
                  status
                </th>
                <th scope="col" className="px-3 py-1">
                  request type
                </th>
                <th scope="col" className="px-3 py-1">
                  open Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {closeAllTransactions?.map((item, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-gray-100  dark:hover:bg-gray-800 hover:bg-gray-200 border-b  dark:bg-gray-700 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item._id?.slice(0, 6)}
                    </th>
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item.type}
                    </th>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.type == "Stock"
                        ? item?.stock
                        : item?.from + "➞" + item?.to}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.unit}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      <span
                        className={` ${
                          item.status == "pending" || item.status == "close"
                            ? "bg-red-500 "
                            : "bg-green-500"
                        }  py-0 px-2 rounded text-white font-semibold`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.orderType}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.openAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          // <h6 className="text-md font-semibold uppercase text-gray-500 dark:text-gray-300">
          //   No Close records found
          // </h6>
          <h6 className="my-6 bg-[#f69320] px-2 text-md font-semibold uppercase text-gray-500 dark:text-gray-300 text-center">
          No Close records found!
        </h6>
        )}
      </div>
        {/* Pending Transactions  */}
        <h1 className="py-4 text-xl text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
          Pending Transactions History
        </h1>
      <div className="relative overflow-x-auto mt-0  ">
        {pendingAllTransactions?.length > 0 ? (
          <table className="w-full text-gray-500 dark:text-gray-300 relative text-sm text-left bg-gray-100 dark:bg-gray-800 ">
            <thead className="text-xs text-gray-500 dark:text-gray-300  sticky -top-4 z-0 uppercase bg-gray-300 dark:bg-gray-900 ">
              <tr>
                <th scope="col" className="px-3 py-1">
                  ID
                </th>
                <th scope="col" className="px-3 py-1">
                  type
                </th>
                <th scope="col" className="px-3 py-1">
                  Element
                </th>
                <th scope="col" className="px-3 py-1">
                  Unit
                </th>
                <th scope="col" className="px-3 py-1">
                  status
                </th>
                <th scope="col" className="px-3 py-1">
                  request type
                </th>
                <th scope="col" className="px-3 py-1">
                  open Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingAllTransactions?.map((item, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-gray-100  dark:hover:bg-gray-800 hover:bg-gray-200 border-b  dark:bg-gray-700 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item._id?.slice(0, 6)}
                    </th>
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white"
                    >
                      {item.type}
                    </th>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.type == "Stock"
                        ? item?.stock
                        : item?.from + "➞" + item?.to}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.unit}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      <span
                        className={` ${
                          item.status == "pending" || item.status == "close"
                            ? "bg-red-500 "
                            : "bg-green-500"
                        }  py-0 px-2 rounded text-white font-semibold`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.orderType}
                    </td>
                    <td className="px-3 py-2 font-normal text-gray-500 whitespace-nowrap dark:text-white">
                      {item.openAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h6 className="my-6 bg-[#f69320] px-2 text-md font-semibold uppercase text-gray-500 dark:text-gray-300 text-center">
            No Pending records found!
          </h6>
        )}
      </div>


      {/* {allTranations?.length > 0 ? (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
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
                <th scope="col" className="px-6 py-3">
                  actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allTranations?.map((item, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item?.accountref}
                    </th>
                    <td className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap dark:text-white">
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
                    <td className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap dark:text-white">
                      {item?.amount}
                    </td>
                    <td className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap dark:text-white">
                      {item.transactionID}
                    </td>
                    <td className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap dark:text-white">
                      <img
                        onClick={() => {
                          setmodalVisible(true);
                          setselectedItem(item);
                        }}
                        src={"/gear.png"}
                        className="w-6 h-6 object-contain cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h6 className="text-lg text-gray-600 font-semibold leading-none uppercase ">
          No Transactions Found
        </h6>
      )} */}

      <UpdateRequestModal
        data={selectedItem}
        modalVisible={modalVisible}
        onClose={() => {
          setmodalVisible(!modalVisible);
          setselectedItem([]);
        }}
      />
    </div>
  );
};

export default Alldeposits;

Alldeposits.layout = Main;

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
