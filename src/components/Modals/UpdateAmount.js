import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InputField from "../inputs/InputField";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { handleSubAccount } from "@/store/action/accountActions";

const UpdateAmount = ({
  modalVisible,
  setmodalvisible,
  onClose,
  handleSubmit,
  setcloseAmount,
  closeAmount,
  title = "Update Take Profit & Stop Loss",
  buttonName = "Submit",
  setselected,
  selected,
  refreshData,
}) => {
  // router
  const router = useRouter();

  // states
  const [updStpLoss, setUpdStpLoss] = useState(selected?.stopLoss || 0);
  const [updProLimit, setupdProLimit] = useState(selected?.profitLimit || 0);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const userData = useSelector((state) => state.userReducer.user);

  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  useEffect(() => {
    setUpdStpLoss(selected?.stopLoss);
    setupdProLimit(selected?.profitLimit);
  }, [modalVisible]);

  // dispatch
  const dispatch = useDispatch();

  // handle update
  const _handleUpdate = () => {
    let params = {
      stopLoss: updStpLoss,
      profitLimit: updProLimit,
    };
    axios
      .put(`${Environment.BASE_URL}/order/${selected?._id}`, params, config)
      .then((res) => {
        console.log("_handleUpdate res ==>", res);
        axios
          .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config)
          .then((res2) => {
            if (res2?.data?.data != undefined) {
              dispatch(handleSubAccount(res2?.data?.data));
            }
            Swal.fire({
              icon: "success",

              title: res?.data?.message || "Order Closed Successfully",
              showConfirmButton: false,

              timer: 1800,
              timerProgressBar: true,
            });
            refreshData();
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((error) => {
        console.log("_handleUpdate e ====>", error);
        Swal.fire({
          icon: "error",

          title: error?.message || "Something Went Wrong",
          showConfirmButton: false,

          timer: 3000,
          timerProgressBar: true,
        });
      })
      .finally(() => {
        setmodalvisible(false);
        setselected([]);
      });
  };

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 z-20 w-full h-full bg-[rgba(0,0,0,0.5)]`}
    >
      <div className="flex flex-col relative dark:bg-gray-700 dark:text-white bg-gray-700 px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>
        <h1 className="text-center text-gray-200 text-xl font-extrabold mb-5">
          {title}
        </h1>
        <div className="flex flex-col justify-start w-9/12">
          <label
            for="first_name"
            class="block  text-sm uppercase font-medium text-gray-300 dark:text-white"
          >
            Take Profit
          </label>
          <InputField
            placeholder="0"
            value={updProLimit}
            onChange={(e) => {
              const newVal = e.target.value < 0 ? 0 : e.target.value;
              setupdProLimit(newVal);
            }}
            type="number"
          />
        </div>
        <div className="flex flex-col justify-start w-9/12">
          <label
            for="first_name"
            class="block  text-sm uppercase font-medium text-gray-300 dark:text-white"
          >
            Stop Loss
          </label>
          <InputField
            placeholder="0"
            value={updStpLoss}
            onChange={(e) => {
              const newVal = e.target.value < 0 ? 0 : e.target.value;
              setUpdStpLoss(newVal);
            }}
            type="number"
          />
        </div>

        <div
          onClick={() => _handleUpdate()}
          className="bg-[#f69320] mt-10 hover:scale-105 duration-150 text-white text-md font-semibold uppercase px-20 rounded cursor-pointer py-2"
        >
          {buttonName}
        </div>
      </div>
    </div>
  );
};

export default UpdateAmount;
