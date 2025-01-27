import React from "react";
import Loader from "./Loader";
import MyComponent from "@/components/AdjustableDiv";

const TransactionsModal = ({
  modalVisible,
  setModalVisible,
  loading,
  children,
  setDragging,
}) => {
  return (
    <MyComponent setDragging={setDragging}>
      {/* <div
        className={`${
          !modalVisible ? "hidden" : "flex flex-col"
        }  items-center justify-end duration-150  pb-0 inset-0 w-full h-full `}
      > */}
      <div className=" flex flex-col  p-0 bg-gray-100 dark:bg-gray-800 w-full h-full overflow-y-auto relative ">
        {/* <div className="absolute top-2 right-8">
          <div
            className=" bg-black text-white px-3 mb-2 rounded cursor-pointer"
            onClick={() => setModalVisible(!modalVisible)}
          >
            x
          </div>
        </div> */}
        {loading == true ? <Loader /> : children}
      </div>
      {/* </div> */}
    </MyComponent>
  );
};

export default TransactionsModal;
