import Environment from "@/constants/apiEndPoints";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const UpdateRequestModal = ({ modalVisible, onClose, data }) => {
  // state
  const state = useSelector((state) => state.userReducer);
  // console.log("====================================");
  // console.log(data);
  // console.log("====================================");

  // router
  const router = useRouter();

  // config
  const config = {
    headers: {
      Authorization: state.admin?.data?.token,
    },
  };

  // handle Update
  const _handleUpdateRequest = () => {
    axios
      .put(
        `${Environment.BASE_URL}admin/request/${data?._id}`,
        {
          status: "accepted",
        },
        config
      )
      .then((res) => {
        Swal.fire({
          title: "Request Updated Successfully",
          icon: "success",
          timer: 2000,
        }).then((res) => {
          router.reload();
          onClose();
        });
      })
      .catch((error) => {
        console.log("error -==>", error);
        Swal.fire({
          title: error?.message || "SomeThing Went Wrong",
          icon: "error",
        });
      });
  };
  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]`}
    >
      <div className="flex flex-row relative bg-white px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>
        <div className="flex flex-col w-full">
          <p className="text-2xl text-gray-600  text-center font-semibold mb-5">
            Update Request{" "}
          </p>
          <p className="text-md text-gray-600 border-b mb-3 capitalize">
            Account Ref:{" "}
            <span className="text-lg ml-4 text-gray-900 font-semibold">
              {data?.accountref}
            </span>
          </p>
          <p className="text-md text-gray-600 border-b mb-3 capitalize">
            Payment Type:{" "}
            <span className="text-lg ml-4 text-gray-900 font-semibold">
              {data?.paymentType}
            </span>
          </p>
          <p className="text-md text-gray-600 border-b mb-3 capitalize">
            status :{" "}
            <span
              className={`text-lg ml-4 ${
                data?.status == "pending" ? "bg-red-500 " : "bg-green-500"
              } text-white px-3 py-0 rounded-md font-semibold`}
            >
              {data?.status}
            </span>
          </p>
          <p className="text-md text-gray-600 border-b mb-3 capitalize">
            transactionID :{" "}
            <span className="text-lg ml-4 text-gray-900 font-semibold">
              {data?.transactionID}
            </span>
          </p>
          <p className="text-md text-gray-600 border-b mb-3 capitalize">
            Amount :{" "}
            <span className="text-lg ml-4 text-gray-900 font-semibold">
              {data?.amount}
            </span>
          </p>

          <div className="w-full flex gap-x-4   mt-5">
            <div
              onClick={() => _handleUpdateRequest()}
              className="flex-1 bg-[#0a4c88] px-4 py-2 rounded-md text-white cursor-pointer font-semibold uppercase text-center"
            >
              Approve
            </div>
            <div
              onClick={onClose}
              className="flex-1 bg-[#f69320] px-4 py-2 rounded-md text-white cursor-pointer font-semibold uppercase text-center"
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequestModal;
