import Image from "next/image";
import React, { Children } from "react";
import { useSelector } from "react-redux";

const BuySellModal = ({ modalVisible, setModalVisible, title, children }) => {
  // state
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  // console.log("subUser ===>", subUser);
  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex  flex-col"
      }  fixed  items-center justify-start p-10 pt-1 inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]`}
    >
      <div className=" flex flex-col relative bg-white dark:bg-gray-800 p-2 rounded z-50  px-0 w-full md:w-5/12 h-54 overflow-y-auto  ">
        <div className="flex justify-between items-center px-4 ">
          {/* Title */}
          <p className="text-sm white-gray-700 font-bold text-gray-500 dark:text-gray-300">
            {title}
          </p>

          {/* Sub User */}
          <div className="flex">
            <Image
              src={"/DummyImage.png"}
              width={50}
              height={50}
              alt="user image"
              className="w-14 h-14"
            />
            <div className="flex flex-col justify-center">
              <p className="text-xs white-gray-700 font-normal font-montserrat capitalize text-gray-500 dark:text-gray-300">
                logged In as:{" "}
                <span className="text-xs font-semibold">{subUser?.name}</span>
              </p>
              <p className="text-xs white-gray-700 font-normal font-montserrat capitalize text-gray-500 dark:text-gray-300">
                Account Type:{" "}
                <span className="text-xs font-semibold">{subUser?.type}</span>
              </p>
              <p className="text-xs white-gray-700 font-normal font-montserrat capitalize text-gray-500 dark:text-gray-300">
                Balance:{" "}
                <span className="text-xs font-semibold">
                  {subUser?.balance?.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
          {/* Cross Button */}
          <div
            className=" bg-black text-white px-3 mb-2 w-7 h-7 flex justify-center rounded cursor-pointer"
            onClick={() => {
              setModalVisible(!modalVisible);
            }}
          >
            x
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BuySellModal;
