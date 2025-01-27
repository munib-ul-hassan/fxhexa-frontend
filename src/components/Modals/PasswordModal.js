import React, { useState } from "react";
import ButtonWithIcon from "../ButtonWithIcon";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { handleSubAccount } from "@/store/action/accountActions";

const PasswordModal = ({ modalVisible, onClose, data }) => {
  // states
  const [password, setPassword] = useState("");
  const state = useSelector((state) => state);
  const [loading, setloading] = useState(false);

  // dispatch
  const dispatch = useDispatch();

  //   //config
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: userData.token,
  //     },
  //   };

  // POST sub account
  const _handleSubAcc = (e) => {
    e.preventDefault();
    let params = {
      name: data.name,
      password: password,
    };

    if (password == "" || password.length < 6) {
      Swal.fire({
        title: "Password is Required",
        icon: "error",
      });
    } else {
      console.log("params ==>", params);

      axios
        .post(`${Environment.BASE_URL}auth/subacc/login`, params)
        .then((res) => {
          setloading(true);
          if (res?.data?.status == true) {
            dispatch(handleSubAccount(res?.data?.data));
            onClose();
            Swal.fire({
              titleText: `Logged In as ${res?.data?.data?.name}`,
              icon: "success",
              showConfirmButton: false,
              timer: 1800,
              timerProgressBar: true,
            });
          } else {
            onClose();
            Swal.fire({
              titleText: ` ${res?.data?.message}`,
              icon: "error",
              confirmButtonColor: "#1e69ae",
            });
          }
        })
        .catch((err) => {
          console.log("err ====>", err);
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]`}
    >
      <div className="flex flex-row relative bg-white dark:bg-gray-800  px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>
        <div className="flex flex-col  font-montserrat">
          <h2 className="text-xl text-gray-500 dark:text-gray-300 font-normal capitalize">
            you are logging In as:{" "}
            <span className="font-bold">{data.name}</span>
          </h2>

          <div className="flex flex-row justify-start gap-x-4 mt-3">
            <h6 class="text-lg text-gray-500 dark:text-gray-300 font-normal  ">
              Balance:{" "}
              <span className="font-semibold">{data.balance?.toFixed(2)}</span>
            </h6>
            <h6 class="text-lg text-gray-500 dark:text-gray-300 font-normal  ">
              Account Type:{" "}
              <span className="font-semibold capitalize">{data.type}</span>
            </h6>
          </div>

          <div className="mt-8 flex flex-col items-start">
            <form onSubmit={(e) => _handleSubAcc(e)} className="w-full">
              <label class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 ">
                Please Type your Password
              </label>
              <input
                type="password"
                class="dark:bg-slate-700 bg-gray-100 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ButtonWithIcon
                bgColor={"bg-[#f69320]"}
                name={"Submit"}
                border={false}
                marginTailwind="mt-6"
                onClick={(e) => _handleSubAcc(e)}
                isSubmit={true}
                loading={loading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
