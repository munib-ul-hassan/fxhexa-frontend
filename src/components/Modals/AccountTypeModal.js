import { handleAccountType } from "@/store/action/accountActions";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const AccountTypeModal = ({ modalVisible, onClose }) => {
  // dispatch
  const dispatch = useDispatch();

  // router
  const router = useRouter();

  // states
  const [accType, setaccType] = useState("");

  // handle modal close
  const _handleModalClose = () => {
    if (accType == "") {
      Swal.fire({
        title: "Please select your account type to proceed",
        icon: "error",
      });
    } else {
      onClose();
      dispatch(handleAccountType(accType));
    }
  };

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]`}
    >
      <div className="flex flex-col relative bg-white px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <h1 className="text-center text-3xl font-extrabold ">
            Please select your account type
          </h1>
        </div>
        <div className=" mt-10">
          <div class="radio-container">
            <div class="radio-wrapper">
              <label class="radio-button">
                <input
                  id="option1"
                  name="radio-group"
                  type="radio"
                  value={"demo"}
                  onChange={(e) => {
                    setaccType(e.target.value);
                  }}
                />
                <span class="radio-checkmark"></span>
                <span class="radio-label">Demo Account</span>
              </label>
            </div>

            <div class="radio-wrapper">
              <label class="radio-button">
                <input
                  id="option2"
                  name="radio-group"
                  type="radio"
                  value={"real"}
                  onChange={(e) => {
                    setaccType(e.target.value);
                  }}
                />
                <span class="radio-checkmark"></span>
                <span class="radio-label">Real Account</span>
              </label>
            </div>

            <div
              onClick={_handleModalClose}
              className="bg-[#f69320] text-white px-5 py-2 uppercase text-center rounded mt-10 cursor-pointer "
            >
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeModal;
