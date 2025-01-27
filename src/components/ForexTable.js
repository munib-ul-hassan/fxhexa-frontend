import CloseOrderModal from "@/components/Modals/CloseOrderModal";
import Environment from "@/constants/apiEndPoints";
import { handleSubAccount } from "@/store/action/accountActions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import UpdateAmount from "./Modals/UpdateAmount";

const ForexTable = ({
  data,
  type = "",
  handleCancel,
  currentOpenAmount,
  closeAmountModal,
  setcloseAmountModal,
  refresh,
}) => {
  // states
  const [selecteditem, setselecteditem] = useState([]);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const userData = useSelector((state) => state.userReducer.user);
  const [updateModal, setupdateModal] = useState(false);
  const [selectedProfitLoss, setSelectedProfitLoss] = useState(0);
  const { forex, metals, stocks, oils } = useSelector(
    (state) => state.forexReducer
  );
  const allStocksData = [
    ...(forex || []),
    ...(metals || []),
    ...(stocks || []),
    ...(oils || []),
  ];
  const [currAmount, setcurrAmount] = useState(0);

  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  // dispatch
  const dispatch = useDispatch();

  // handle Close
  const _handleClose = () => {
    let params = {
      subAccId: subUser?._id,
      orderId: [selecteditem?._id],
      closeAmount: currAmount,
      amount:
        selecteditem.orderType == "buy"
          ? selectedProfitLoss.toFixed(3)
          : (selectedProfitLoss * -1).toFixed(3),
    };
    // let params = {
    //   subAccId: subUser?._id,
    //   orderId: [selecteditem?._id],
    //   closeAmount: 0,
    //   amount: 0,
    // };
    if (type == "pending") {
      params.amount = 0;
    }

    console.log(params);
    axios
      .post(`${Environment.BASE_URL}forex/close`, params, config)
      .then((res) => {
        axios
          .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config)
          .then((res2) => {
            if (res2?.data?.data != undefined) {
              dispatch(handleSubAccount(res2?.data?.data));
            }

            console.log("this is mee api", res2);

            Swal.fire({
              icon: "success",

              title: res?.data?.message || "Order Closed Successfully",
              showConfirmButton: false,

              timer: 1800,
              timerProgressBar: true,
            });
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((error) => {
        console.log("e ====>", error);
        Swal.fire({
          icon: "error",

          title: error?.message || "Something Went Wrong",
          showConfirmButton: false,

          timer: 3000,
          timerProgressBar: true,
        });
      })
      .finally(() => {
        setcloseAmountModal(false);
        setselecteditem([]);
        setcurrAmount(0);
        setSelectedProfitLoss(0);
      });
  };

  useEffect(() => {}, [forex, metals, stocks]);

  function formatNumberDigit(inputNumber, i) {
    // Convert the input number to a string
    const numString = inputNumber?.toString();

    // Check if the input has a decimal point
    const decimalIndex = numString?.indexOf(".");

    const decimalafter = numString?.split(".")[1];
    const decimalafterLength = decimalafter?.length;

    // Calculate the number of decimal digits
    const decimalDigits =
      decimalIndex !== -1 ? numString?.length - decimalIndex - 1 : inputNumber;

    const maxDigit = Math.pow(10, Math.max(0, decimalDigits));

    const multiplier = maxDigit * inputNumber;

    if (i < 2) {
      console.log("decimalafter", decimalafter);
    }

    let result = 0;

    if (decimalafterLength == 2) {
      result = multiplier * 1000;
    } else if (decimalafterLength == 1) {
      result = multiplier * 10000;
    } else {
      result = multiplier * 10000;
    }

    return result;
  }

  function formatNumberDigit2(inputNumber, i) {
    // Convert the input number to a string
    const numString = inputNumber?.toString();

    // Check if the input has a decimal point
    const decimalIndex = numString?.indexOf(".");

    const decimalafter = numString?.split(".")[1];
    const decimalafterLength = decimalafter?.length;

    // Calculate the number of decimal digits
    const decimalDigits =
      decimalIndex !== -1 ? numString?.length - decimalIndex - 1 : inputNumber;

    const maxDigit = Math.pow(10, Math.max(0, decimalDigits));

    const multiplier = maxDigit * inputNumber;

    let result = 0;

    if (decimalafterLength == 2) {
      result = multiplier * 10;
    } else if (decimalafterLength == 1) {
      result = multiplier * 100;
    } else {
      result = multiplier * 100;
    }

    return result;
  }

  function formatNumberDigit3(inputNumber) {
    // Convert the input number to a string
    const numString = inputNumber?.toString();

    // Check if the input has a decimal point
    const decimalIndex = numString?.indexOf(".");

    const decimalafter = numString?.split(".")[1];
    const decimalafterLength = decimalafter?.length;

    // Calculate the number of decimal digits
    const decimalDigits =
      decimalIndex !== -1 ? numString?.length - decimalIndex - 1 : inputNumber;

    const maxDigit = Math.pow(10, Math.max(0, decimalDigits));

    const multiplier = maxDigit * inputNumber;

    let result = 0;

    if (decimalafterLength == 2) {
      result = multiplier * 7;
    } else if (decimalafterLength == 1) {
      result = multiplier * 70;
    } else {
      result = multiplier * 70;
    }

    return result;
  }

  return (
    <>
      <CloseOrderModal
        modalVisible={closeAmountModal}
        onClose={() => {
          setselecteditem([]);
          setcloseAmountModal(false);
          setcurrAmount(0);
        }}
        isInputField={false}
        title="Are You Sure, You want to Close the Order"
        handleSubmit={_handleClose}
        buttonName="Close Order"
      />
      <UpdateAmount
        selected={selecteditem}
        setselected={setselecteditem}
        modalVisible={updateModal}
        setmodalvisible={setupdateModal}
        refreshData={refresh}
        onClose={() => {
          setupdateModal(false);
          setselecteditem([]);
        }}
      />
      <div className="relative overflow-x-auto mt-0 px-4 py-1 ">
        {data?.length > 0 ? (
          <table className="w-full relative text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-200  sticky -top-4 z-0 uppercase bg-gray-500 ">
              <tr>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  order id
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  symbol
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  size
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  status
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  request type
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  {type == "pending" ? "Order Place Price" : "open price"}
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  {type == "close" ? "Closing Amount" : "Current price"}
                </th>

                {type != "pending" && (
                  <th scope="col" className="px-1 py-1 text-[10px]">
                    Profit/Loss
                  </th>
                )}
                <th scope="col" className="px-1 py-1 text-[10px]">
                  TP
                </th>
                <th scope="col" className="px-1 py-1 text-[10px]">
                  SL
                </th>
                {(type == "open" || type == "pending") && (
                  <th scope="col" className="px-1 py-1 text-[10px]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => {
                let currentOpen = 0;
                if (item.type == "Stock") {
                  const newItem = allStocksData.find((x) =>
                    item.stock.includes(x?.currency)
                  );

                  currentOpen = newItem?.ask;
                } else {
                  const newCurr = item?.from + "/" + item?.to;
                  const newItem = allStocksData?.find(
                    (x) => newCurr == x?.currency
                  );

                  currentOpen = Number(newItem?.ask);
                }
                if (type == "close") {
                  console.log("this is close price");
                  currentOpen = Number(item.closeAmount);
                }
                const profitLoss =
                  Number(currentOpen).toFixed(4) -
                  Number(item.openAmount)?.toFixed(4);
                const newUnit = (item?.unit * 100)?.toFixed(4);

                let profitLossNew = 0;

                function countNumbersBeforeDecimal(inputNumber) {
                  // Convert the input number to a string
                  const numString = Math.abs(inputNumber).toString();

                  const decimalIndex = numString.indexOf(".");

                  return decimalIndex === -1 ? -1 : decimalIndex;
                }
                const befPoint = countNumbersBeforeDecimal(item?.openAmount);

                if (item.type == "Stock" && befPoint != 2) {
                  profitLossNew = Number(profitLoss * newUnit);
                } else {
                  if (befPoint == 1) {
                    const newVal = formatNumberDigit(item?.unit, i);

                    profitLossNew = Number(profitLoss * newVal);
                  } else if (befPoint == 2) {
                    const newVal = formatNumberDigit2(item?.unit, i);
                    profitLossNew = Number(profitLoss * newVal);
                  } else if (befPoint == 3) {
                    const newVal = formatNumberDigit3(item?.unit);
                    profitLossNew = Number(profitLoss * newVal);
                  }
                }

                return (
                  <tr
                    key={i}
                    className="bg-[#1a2330] border-b border-gray-500 hover:bg-gray-800 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item?._id}
                    </th>
                    <th className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item.type == "Stock"
                        ? item?.stock
                        : item?.from + "➞" + item?.to}
                    </th>
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item.type == "Stock" ? item?.unit : item?.unit}
                    </td>
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      <span
                        className={` ${
                          item.status == "pending" || item.status == "close"
                            ? "bg-red-500 "
                            : "bg-green-500"
                        }  py-0 px-2 rounded text-white font-semibold uppercase`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item.orderType}
                    </td>
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item.openAmount}
                    </td>
                    <td
                      className={`px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white`}
                    >
                      {type == "close" ? item.closeAmount : Number(currentOpen)}
                    </td>
                    {item.status != "pending" && (
                      <td
                        className={`px-1 text-[9px] font-bold ${
                          item?.orderType == "buy"
                            ? profitLossNew < 0
                              ? "text-red-500"
                              : "text-green-500"
                            : profitLossNew > 0
                            ? "text-red-500"
                            : "text-green-500"
                        } whitespace-nowrap`}
                      >
                        {item?.orderType == "sell"
                          ? (profitLossNew * -1)?.toFixed(3)
                          : profitLossNew?.toFixed(3)}
                      </td>
                    )}
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item?.profitLimit || 0}
                    </td>
                    <td className="px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                      {item?.stopLoss || 0}
                    </td>
                    {(type == "open" || type == "pending") && (
                      <td className="flex justify-start gap-x-2 mt-1 items-center px-1 text-[9px] font-normal text-gray-400 whitespace-nowrap dark:text-white">
                        <img
                          onClick={() => {
                            setselecteditem(item);
                            setcloseAmountModal(true);
                            setcurrAmount(currentOpen);
                            setSelectedProfitLoss(profitLossNew);
                          }}
                          src={"/cancel.png"}
                          className="w-3 h-3 object-contain hover:scale-110 duration-150 cursor-pointer"
                          alt="cancel buuton image"
                        />
                        <img
                          onClick={() => {
                            setselecteditem(item);
                            setupdateModal(true);
                          }}
                          src={"/pencil.png"}
                          className="w-3 h-3 object-contain hover:scale-110 duration-150 cursor-pointer"
                          alt="cancel buuton image"
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h6 className="text-sm text-gray-400 font-semibold uppercase">
            no records found
          </h6>
        )}
      </div>
    </>
  );
};

export default ForexTable;
