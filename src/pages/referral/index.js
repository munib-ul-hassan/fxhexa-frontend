import Environment from "@/constants/apiEndPoints";
import Main from "@/layout/Main";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Referral = () => {
  // states
  const userData = useSelector((state) => state.userReducer.user);
  const [allRefferals, setAllRefferals] = useState([]);
  const user = useSelector((state) => state.userReducer);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  //config
  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  console.log(user);

  const handleWithdrawalRequest = () => {
    const allValues = {
      amount: "",
      accountref: "",
      // transactionID: "testtest",
      accountName: "",
      paymentType: "",
      requestType: "referel",
      paymentCode: "",
    };

    axios
      .post(`${Environment.BASE_URL}user/request`, allValues, config)
      .then((res) => {
        Swal.fire({
          title: res?.data?.message,
          icon: "info",
          timer: 1800,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then((swalRes) => {
          router.replace("/withdraw/withdraw");
        });
      })
      .catch((error) => {
        console.log("error ==>", error);
        Swal.fire({
          title: error?.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      })
      .finally(() => {});
  };

  const getAllTransations = async () => {
    try {
      const response = await axios.get(
        `${Environment.BASE_URL}auth/refer`,
        config
      );
      console.log("res ==.", response);
      if (Object.keys(response.data?.data)?.length == 0) {
        setAllRefferals([]);
      } else {
        setAllRefferals(response.data?.data);
        let total = 0;
        response.data?.data.forEach((item) => (total += item.amount));
        setTotalAmount(total);
      }
    } catch (err) {
      console.log("err ==>", err);
    }
  };

  // handle copy referral
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
        }).then(() => {});
      });
  };

  useEffect(() => {
    getAllTransations();
    console.log(user);
  }, []);

  return (
    <div className="px-8 py-4 min-h-screen relative bg-white dark:bg-gray-800">
      <div className="flex flex-row justify-between mb-3">
        <h1 className=" text-lg text-gray-500 dark:text-gray-300 font-bold leading-none uppercase ">
          All Referrals
        </h1>
      </div>
      <div className="relative overflow-x-auto mt-0  ">
        {allRefferals?.length ? (
          <>
            {" "}
            <div className="border p-2 flex flex-row justify-between items-center gap-x-3 w-fit mb-1">
              <p className="text-sm text-[#f69320] font-semibold font-montserrat border-r px-2  ">
                {`https://fx-web-82cccad64386.herokuapp.com/auth/register-user?referralcode=${user?.user?.refereCode}`}
              </p>
              <img
                onClick={() => _handleCopyReferral()}
                src={"/copy.png"}
                className="w-4 h-4 cursor-pointer object-contain"
                alt="copy image "
              />
            </div>
            <table className="w-full text-gray-500 dark:text-gray-300 relative text-sm text-left bg-gray-100 dark:bg-gray-800">
              <thead className="text-xs text-gray-500 dark:text-gray-300  sticky -top-4 z-0 uppercase bg-gray-300 dark:bg-gray-900  ">
                <tr className="bg-gray-100 border-b  dark:bg-gray-700 dark:border-gray-700">
                  <th scope="col" className="px-3 py-3">
                    user id
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Fullname
                  </th>
                  <th scope="col" className="px-3 py-3">
                    amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRefferals?.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className="bg-gray-100  dark:hover:bg-gray-800 hover:bg-gray-200 border-b  dark:bg-gray-700 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-3 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white"
                      >
                        {item?.user?._id || "-"}
                      </th>
                      <td className="px-3 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white">
                        {item.user?.fullName || "dummy name"}
                      </td>

                      <td className="px-3 py-4 font-normal text-gray-300 whitespace-nowrap dark:text-white">
                        {item.amount.toFixed(2) || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br></br>
            <button
              onClick={() =>
                router.replace(`/referral/create?amount=${totalAmount}`)
              }
              className="bg-[#f69320] text-white font-semibold px-4 py-1 rounded-md hover:opacity-90"
            >
              Withdraw All Referral Amount
            </button>
          </>
        ) : (
          <div className="flex flex-row justify-between items-center mt-5">
            <h6 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-300">
              no Referral found
            </h6>

            <div className="border p-2 flex flex-row justify-between items-center space-x-3">
              <p className="text-sm text-[#f69320] font-semibold font-montserrat border-r px-2  ">
                {`https://fx-web-82cccad64386.herokuapp.com/auth/register-user?referralcode=${user?.user?.refereCode}`}
              </p>
              <img
                onClick={() => _handleCopyReferral()}
                src={"/copy.png"}
                className="w-4 h-4 cursor-pointer object-contain"
                alt="copy image "
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referral;

Referral.layout = Main;

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
