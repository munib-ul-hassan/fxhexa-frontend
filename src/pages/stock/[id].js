import React, { useState, useEffect, useRef, memo } from "react";
import Main from "@/layout/Main";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import TradingView from "@/components/TradingView";
import BuySellModal from "@/components/Modals/BuySellModal";
import Environment from "@/constants/apiEndPoints";
import TransactionsModal from "@/components/TransactionsModal";
import { TransactionSchema } from "@/components/Schema/TransactionSchema";
import TransactionsTable from "../../components/TransactionsTable";
import LoginModal from "@/components/Modals/LoginModal";
import CloseOrderModal from "@/components/Modals/CloseOrderModal";
import { handleSubAccount } from "@/store/action/accountActions";

const stkData = [
  [
    {
      "1. open": "240.0200",
      "2. high": "247.5500",
      "3. low": "238.6500",
      "4. close": "246.3800",
      "5. volume": "117058870",
    },
    {
      "1. open": "244.2620",
      "2. high": "245.3300",
      "3. low": "234.5800",
      "4. close": "240.5000",
      "5. volume": "136597184",
    },
    {
      "1. open": "242.9800",
      "2. high": "249.5500",
      "3. low": "241.6601",
      "4. close": "244.1200",
      "5. volume": "101993631",
    },
    {
      "1. open": "243.3800",
      "2. high": "247.1000",
      "3. low": "238.3100",
      "4. close": "246.9900",
      "5. volume": "104636557",
    },
    {
      "1. open": "257.4000",
      "2. high": "257.7888",
      "3. low": "244.4800",
      "4. close": "244.8800",
      "5. volume": "127524083",
    },
    {
      "1. open": "257.8500",
      "2. high": "260.8600",
      "3. low": "254.2100",
      "4. close": "255.7000",
      "5. volume": "119951516",
    },
    {
      "1. open": "267.0400",
      "2. high": "273.9300",
      "3. low": "262.4606",
      "4. close": "262.5900",
      "5. volume": "122514643",
    },
    {
      "1. open": "264.3500",
      "2. high": "267.8500",
      "3. low": "261.2000",
      "4. close": "266.5000",
      "5. volume": "103704040",
    },
    {
      "1. open": "271.1600",
      "2. high": "271.4400",
      "3. low": "263.7601",
      "4. close": "265.2800",
      "5. volume": "101543305",
    },
    {
      "1. open": "277.5500",
      "2. high": "278.9800",
      "3. low": "271.0000",
      "4. close": "274.3900",
      "5. volume": "133692313",
    },
    {
      "1. open": "271.3200",
      "2. high": "276.7094",
      "3. low": "270.4200",
      "4. close": "276.0400",
      "5. volume": "107709842",
    },
    {
      "1. open": "270.0700",
      "2. high": "274.9800",
      "3. low": "268.1000",
      "4. close": "271.3000",
      "5. volume": "111673737",
    },
    {
      "1. open": "270.7600",
      "2. high": "278.3900",
      "3. low": "266.6000",
      "4. close": "267.4800",
      "5. volume": "135999866",
    },
    {
      "1. open": "264.2700",
      "2. high": "274.8500",
      "3. low": "260.6100",
      "4. close": "273.5800",
      "5. volume": "174667852",
    },
    {
      "1. open": "251.2200",
      "2. high": "256.5200",
      "3. low": "246.6700",
      "4. close": "248.5000",
      "5. volume": "118559635",
    },
    {
      "1. open": "245.0700",
      "2. high": "252.8100",
      "3. low": "243.2650",
      "4. close": "251.4900",
      "5. volume": "115312886",
    },
    {
      "1. open": "255.1350",
      "2. high": "255.3900",
      "3. low": "245.0600",
      "4. close": "251.9200",
      "5. volume": "116959759",
    },
    {
      "1. open": "245.0000",
      "2. high": "258.0000",
      "3. low": "244.8600",
      "4. close": "256.4900",
      "5. volume": "129469565",
    },
    {
      "1. open": "257.2600",
      "2. high": "259.0794",
      "3. low": "242.0100",
      "4. close": "245.0100",
      "5. volume": "132541640",
    },
    {
      "1. open": "255.9800",
      "2. high": "261.1800",
      "3. low": "255.0500",
      "4. close": "258.0800",
      "5. volume": "108861698",
    },
  ],
];

const Stock = ({ ticket, ticket2 }) => {
  // router
  const router = useRouter();

  // dispatch
  const dispatch = useDispatch();

  // state
  const [buySellModal, setBuySellModal] = useState(false);
  const [paymentType, setPaymentType] = useState("buy");
  const [selected, setSelected] = useState("open");
  const [allTransactions, setallTransactions] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [loginModal, setloginModal] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const [stockData, setstockData] = useState([]);
  const [indexStock, setindexStock] = useState(0);
  const [shortAmount, setShortAmount] = useState(0.1);
  const [dragging, setDragging] = useState(false);

  // const allStocks = useSelector((state) => {
  //   const stocks = state.forexReducer.stocks || [];
  //   const forex = state.forexReducer.forex || [];
  //   const metals = state.forexReducer.metals || [];

  //   // Using concat method
  //   return stocks.concat(forex, metals);
  // });

  // const { restClient } = require("@polygon.io/client-js");
  // const rest = restClient("x5Vm09UZQ8XJpEL0SIgpKJxaROq8jgeQ");

  // useEffect(() => {
  //   rest.stocks
  //     .aggregates("GOLD", 1, "day", "2019-01-01", "2019-02-01")
  //     .then((data) => {
  //       console.log("===========================>", data);
  //     })
  //     .catch((e) => {
  //       console.error("An error happened:", e);
  //     });
  // }, []);

  // config
  const config1 = {
    headers: {
      Authorization: user.user.token,
    },
  };

  // // config
  const config = {
    headers: {
      Authorization: user.user.token,
      "Content-Type": "multipart/form-data",
    },
  };

  // GET transactions
  async function _getTransactions() {
    try {
      const response = await axios.get(
        `${Environment.BASE_URL}order/getOrder?limit=500&subAccId=${subUser?._id}`,
        config1
      );

      setallTransactions(response.data?.data);
    } catch (err) {
      console.log("err ==>", err);
    }
  }

  useEffect(() => {
    _getTransactions();
  }, [selected, modalVisible]);

  // // pending
  const pendingTransactions = allTransactions?.pending;
  // // open
  const openTransactions = allTransactions?.open;

  // // close
  const closeTransactions = allTransactions?.close;

  // // GET stock details
  const getStockDetails = () => {
    // console.log(`${Environment.BASE_URL}stock?ticket=${ticket2}`);
    let newTicket = ticket2.replace("#", "%23");

    axios
      .get(`${Environment.BASE_URL}stock?ticket=${newTicket}`)
      .then((res) => {
        setstockData(res?.data?.data);
        setpendingState({
          ...pendingState,
          openAmount: res?.data?.data?.ask,
        });
      })
      .catch((err) => {
        console.log("getStockDetails err ====>", err);
      });
  };

  useEffect(() => {
    getStockDetails();
  }, [ticket]);

  useEffect(() => {
    const intervalId2 = setInterval(() => {
      getStockDetails();

      // setopenAmount(stockData[newIndex]?.["1. open"]);
    }, 100000);

    return () => clearInterval(intervalId2);
  }, []);

  useEffect(() => {
    fetch(`${Environment.BASE_URL}user/me/${subUser._id}`, config1)
      .then((res) => res.json())
      .then((meres) => {
        console.log("this is mee api", meres);

        if (meres?.data !== undefined) {
          dispatch(handleSubAccount(meres?.data));
        }
      })
      .catch((err2) => {
        console.log(err2);
      });
  }, []);

  // handleChange
  const handleChangeInput = (name, value, state, setState) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  // state for selling data
  const [sellState, setSellState] = useState({
    subAccId: subUser?._id,
    unit: 0.01,
    stock: ticket2,
    openAmount: stockData?.ask,
    orderType: "sell",
    stopLoss: 0,
    profitLimit: 0,
  });

  // state for buying data
  const [buyState, setBuyState] = useState({
    subAccId: subUser?._id,
    unit: 0.01,
    stock: ticket2,
    openAmount: stockData?.bid,
    orderType: "buy",
    stopLoss: 0,
    profitLimit: 0,
  });

  // state for pending data
  const [pendingState, setpendingState] = useState({
    subAccId: subUser?._id,
    unit: 0.01,
    stock: ticket2,
    openAmount: 0,
    orderType: "sell",
    status: "pending",
    stopLoss: 0,
    profitLimit: 0,
  });

  useEffect(() => {
    setSellState({
      ...sellState,
      openAmount: stockData?.ask,
    });
    setBuyState({
      ...buyState,
      openAmount: stockData?.bid,
    });
  }, [paymentType, buySellModal]);

  // handle sell submit
  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (sellState.unit == 0) {
      Swal.fire({
        title: "Stock Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      axios
        .post(`${Environment.BASE_URL}order/open`, sellState, config1)
        .then((res) => {
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              Swal.fire({
                title: res?.data?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then((Res) => {
                if (Res.isConfirmed || Res.isDismissed) {
                  setmodalVisible(true);
                  setBuySellModal(false);
                }
              });
              if (res2?.data?.data !== undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
              _getTransactions();
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((error) => {
          Swal.fire({
            title: error.message,
            icon: "error",
          }).then((Res) => {
            if (Res.isConfirmed || Res.isDismissed) {
              setmodalVisible(true);
              setBuySellModal(false);
            }
          });
        });
    }
  };

  // handle buy submit
  const handleBuySubmit = (e) => {
    e.preventDefault();
    if (shortAmount == 0) {
      Swal.fire({
        title: "Stock Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      axios
        .post(`${Environment.BASE_URL}order/open`, buyState, config1)
        .then((res) => {
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              Swal.fire({
                title: res?.data?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then((Res) => {
                if (Res.isConfirmed || Res.isDismissed) {
                  setmodalVisible(true);
                  setBuySellModal(false);
                }
              });
              if (res2?.data?.data !== undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
              _getTransactions();
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((error) => {
          Swal.fire({
            title: error?.response?.data?.message || "Something Went Wrong",
            icon: "error",
          }).then((Res) => {
            if (Res.isConfirmed || Res.isDismissed) {
              setmodalVisible(true);
              setBuySellModal(false);
            }
          });
        });
    }
  };

  // handle short buy sell
  const _handleShortBuySell = (e, type) => {
    e.preventDefault();
    let params = {
      subAccId: subUser?._id,
      unit: shortAmount?.toString(),
      stock: ticket2,
      openAmount: stockData?.ask,
      orderType: type,
      stopLoss: 0,
      profitLimit: 0,
    };

    if (shortAmount == 0) {
      Swal.fire({
        title: "Forex Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      axios
        .post(`${Environment.BASE_URL}order/open`, params, config1)
        .then((res) => {
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              Swal.fire({
                title: res?.data?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then((Res) => {
                if (Res.isConfirmed || Res.isDismissed) {
                  setBuySellModal(false);
                }
              });
              if (res2?.data?.data !== undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
              _getTransactions();
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((error) => {
          Swal.fire({
            title: error.response?.data?.message || "Something went wrong",
            icon: "error",
          }).then((Res) => {
            if (Res.isConfirmed || Res.isDismissed) {
              setBuySellModal(false);
            }
          });
        })
        .finally(() => {
          _getTransactions();
        });
    }
  };

  // handle pending
  const handlePendingOrder = (e) => {
    e.preventDefault();
    if (pendingState.unit == 0) {
      Swal.fire({
        title: "Stock Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      axios
        .post(`${Environment.BASE_URL}order/open`, pendingState, config1)
        .then((res) => {
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              Swal.fire({
                title: res?.data?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then((Res) => {
                if (Res.isConfirmed || Res.isDismissed) {
                  setmodalVisible(true);
                  setBuySellModal(false);
                }
              });
              if (res2?.data?.data !== undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
              _getTransactions();
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((error) => {
          console.log("handlePendingOrder Error", error);
          Swal.fire({
            title: error.response?.data?.message || "Something went wrong",
            icon: "error",
          }).then((Res) => {
            if (Res.isConfirmed || Res.isDismissed) {
              setmodalVisible(true);
              setBuySellModal(false);
            }
          });
        });
    }
  };
  return (
    <Main
      displaySidebar={
        true
        // Object.keys(user.user).length >= 1 && user.account == "" ? false : true
      }
    >
      <div className="w-full bg-white dark:bg-gray-800 flex items-center flex-col relative">
        <div className="w-full min-h-screen px-4 ">
          <div className="flex flex-row sm:flex-row  w-full ">
            {/* Chart */}
            <div className="overflow-x-auto 0 w-full z-0">
              <div
                className={`flex items-center flex-col w-full relative  z-0 ${
                  dragging && "pointer-events-none"
                } mt-5`}
              >
                <TradingView />

                <div className="flex flex-row justify-center absolute right-20 top-1 items-center ">
                  {/* buy sell buttons */}
                  <div className="flex flex-row items-center">
                    <p
                      onClick={(e) => {
                        if (Object.keys(subUser).length >= 1) {
                          _handleShortBuySell(e, "buy");
                        } else {
                          router.push("/accounts");
                        }
                      }}
                      className="uppercase cursor-pointer flex flex-col text-xs text-white text-center rounded-sm bg-[#f69320] px-2 py-0"
                    >
                      buy
                      <span className="text-xs font-semibold text-green-700">
                        {stockData?.ask}
                      </span>
                    </p>
                    <input
                      step={0.01}
                      min={0.01}
                      max={1}
                      type={"number"}
                      name={"amount"}
                      className={`bg-gray-50 text-center py-1 focus:outline-none  border-gray-300 text-gray-900 text-sm font-montserrat  focus:ring-blue-500 focus:border-blue-500 block w-4/12 `}
                      value={shortAmount}
                      onChange={(e) => {
                        const newValue =
                          e.target.value < 0
                            ? 0
                            : e.target.value > 1
                            ? 1
                            : e.target.value;

                        setShortAmount(Number(newValue));
                      }}
                      required={true}
                    />

                    <p
                      onClick={(e) => {
                        if (Object.keys(subUser).length >= 1) {
                          _handleShortBuySell(e, "sell");
                        } else {
                          router.push("/accounts");
                        }
                      }}
                      className="uppercase cursor-pointer flex flex-col text-xs text-white text-center rounded-sm bg-[#f69320] px-2 py-0"
                    >
                      sell
                      <span className="text-xs font-semibold text-red-700">
                        {stockData?.bid}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-center absolute left-10 top-1 items-center ">
                  {/* new orders */}
                  <p
                    onClick={() => {
                      if (Object.keys(subUser).length >= 1) {
                        setBuySellModal(true);
                        setPaymentType("buy");
                        setBuyState({
                          ...buyState,
                          orderType: "buy",
                        });
                      } else {
                        router.push("/accounts");
                      }
                    }}
                    className="px-3 py-1 h-fit uppercase text-sm cursor-pointer bg-[#f69320] font-bold text-gray-700 w-fit rounded"
                  >
                    + New Order
                  </p>
                </div>
                {/* <p
                  onClick={() => {
                    if (Object.keys(subUser).length >= 1) {
                      setBuySellModal(true);
                      setPaymentType("buy");
                      setBuyState({
                        ...buyState,
                        orderType: "buy",
                      });
                    } else {
                      router.push("/accounts");
                    }
                  }}
                  className="px-3 py-1 uppercase text-sm cursor-pointer bg-[#f69320] font-bold text-grray-300 w-fit  mt-2 rounded"
                >
                  + New Order
                </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Buy Sell Modal */}
        <BuySellModal
          modalVisible={buySellModal}
          title={ticket || ""}
          setModalVisible={setBuySellModal}
        >
          <div className="flex flex-row justify-center my-2">
            {/* buy */}
            <div
              onClick={() => {
                setPaymentType("buy");
                setSellState({
                  ...sellState,
                  orderType: "buy",
                });
              }}
              className={` flex flex-col items-center justify-center flex-grow py-1 cursor-pointer hover:opacity-90 ${
                paymentType == "buy" ? "bg-[#0a4c88]" : "bg-gray-400"
              } `}
            >
              <p className="text-white font-semibold uppercase">buy</p>
              <p className="text-green-500 px-1 rounded bg-green-100 text-xs font-semibold uppercase">
                {stockData?.ask}
              </p>
            </div>
            {/* pending */}
            <div
              onClick={() => {
                setPaymentType("pending");
                // setSellState({
                //   ...sellState,
                //   orderType: "pending",
                // });
              }}
              className={` flex flex-col items-center border-x justify-center flex-grow py-1 cursor-pointer hover:opacity-90 ${
                paymentType == "pending" ? "bg-[#0a4c88]" : "bg-gray-400"
              } `}
            >
              <p className="text-white font-semibold uppercase">Pending</p>
              <p className="text-green-500 px-1 text-xs rounded bg-green-100 font-semibold uppercase">
                {stockData?.bid}
              </p>
            </div>
            {/* close */}
            <div
              onClick={() => {
                setPaymentType("sell");
                setSellState({
                  ...sellState,
                  orderType: "sell",
                });
              }}
              className={` flex flex-col items-center justify-center flex-grow py-1 cursor-pointer hover:opacity-90 ${
                paymentType == "sell" ? "bg-[#0a4c88]" : "bg-gray-400"
              } `}
            >
              <p className="text-white font-semibold uppercase">sell</p>
              <p className="text-red-600 px-1 text-xs rounded bg-red-100 font-semibold uppercase">
                {stockData?.bid}
              </p>
            </div>
          </div>

          {paymentType == "buy" ? (
            <div>
              <form
                onSubmit={(e) => handleBuySubmit(e)}
                className="flex flex-row justify-center gap-2 flex-wrap w-full px-2"
              >
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    size
                  </label>
                  <input
                    value={buyState.unit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value > 1
                          ? 1
                          : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        buyState,
                        setBuyState
                      );
                    }}
                    step={0.01}
                    min={0.01}
                    max={1}
                    name="unit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12 ">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stock name
                  </label>
                  <input
                    disabled={true}
                    value={buyState.stock}
                    name="stock"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Stop Loss
                  </label>
                  <input
                    value={buyState.stopLoss}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        buyState,
                        setBuyState
                      );
                    }}
                    step={0.1}
                    name="stopLoss"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Take Profit
                  </label>
                  <input
                    value={buyState.profitLimit}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        buyState,
                        setBuyState
                      );
                    }}
                    step={0.1}
                    name="profitLimit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  onClick={(e) => handleBuySubmit(e)}
                  className="text-white w-11/12 uppercase mt-2 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  p-1 text-center"
                  type="submit"
                >
                  Buy
                </button>
              </form>
            </div>
          ) : paymentType == "sell" ? (
            <div className="flex flex-row justify-center flex-wrap w-full px-2">
              <form
                className="flex flex-row justify-center flex-wrap w-full px-2"
                onSubmit={(e) => handleSellSubmit(e)}
              >
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    size
                  </label>
                  <input
                    value={sellState.unit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value > 1
                          ? 1
                          : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    step={0.01}
                    min={0.01}
                    max={1}
                    name="unit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12 ">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stock name
                  </label>
                  <input
                    disabled={true}
                    value={sellState.stock}
                    name="stock"
                    className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Stop Loss
                  </label>
                  <input
                    value={sellState.stopLoss}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    step={0.1}
                    name="stopLoss"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Take Profit
                  </label>
                  <input
                    value={sellState.profitLimit}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    name="profitLimit"
                    step={0.1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  className="text-white w-11/12 uppercase mt-2 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  p-1 text-center"
                  type="submit"
                  onClick={(e) => handleSellSubmit(e)}
                >
                  Sell
                </button>
              </form>
            </div>
          ) : paymentType == "pending" ? (
            <div className="flex flex-row justify-center  flex-wrap w-full px-2">
              <form
                className="flex flex-row justify-center flex-wrap w-full px-2"
                onSubmit={(e) => handlePendingOrder(e)}
              >
                {/* <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    price
                  </label>
                  <input
                    value={pendingState.price}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="price"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div> */}

                <div className="flex flex-col w-11/12">
                  <label
                    for="countries"
                    class="block uppercase text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select type
                  </label>
                  <select
                    onChange={(e) =>
                      setpendingState({
                        ...pendingState,
                        orderType: e.target.value,
                      })
                    }
                    id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option selected value="buy">
                      Buy Limit
                    </option>
                    <option value="sell">Sell Limit</option>
                    {/* <option value="Buy Stop">Buy Stop </option>
                    <option value="Sell Stop">Sell Stop </option> */}
                  </select>
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    size
                  </label>
                  <input
                    value={pendingState.unit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value > 1
                          ? 1
                          : e.target.value;
                      setpendingState({ ...pendingState, unit: newValue });
                      // handleChangeInput(
                      //   e.target.name,
                      //   newValue,
                      //   pendingState,
                      //   setpendingState
                      // );
                    }}
                    step={0.01}
                    min={0.01}
                    max={1}
                    name="unit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500  dark:text-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Expected Amount
                  </label>
                  <input
                    value={pendingState.openAmount}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      setpendingState({
                        ...pendingState,
                        openAmount: newValue,
                      });
                      // handleChangeInput(
                      //   e.target.name,
                      //   newValue,
                      //   pendingState,
                      //   setpendingState
                      // );
                    }}
                    step={0.1}
                    name="openAmount"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500  dark:text-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12 ">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stock name
                  </label>
                  <input
                    disabled={true}
                    value={pendingState.stock}
                    name="stock"
                    step={0.1}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500  dark:text-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Stop Loss
                  </label>
                  <input
                    value={pendingState.stopLoss}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      setpendingState({ ...pendingState, stopLoss: newValue });
                      // handleChangeInput(
                      //   e.target.name,
                      //   newValue,
                      //   pendingState,
                      //   setpendingState
                      // );
                    }}
                    name="stopLoss"
                    step={0.1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500  dark:text-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Take Profit
                  </label>
                  <input
                    value={pendingState.profitLimit}
                    onChange={(e) => {
                      const newValue = e.target.value < 0 ? 0 : e.target.value;
                      setpendingState({
                        ...pendingState,
                        profitLimit: newValue,
                      });
                      // handleChangeInput(
                      //   e.target.name,
                      //   newValue,
                      //   pendingState,
                      //   setpendingState
                      // );
                    }}
                    name="profitLimit"
                    step={0.1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  className="text-white w-11/12 uppercase mt-2 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  py-1 text-center"
                  type="submit"
                  onClick={(e) => handlePendingOrder(e)}
                >
                  Pending
                </button>
              </form>
            </div>
          ) : null}
        </BuySellModal>

        <LoginModal
          modalVisible={loginModal}
          onClose={() => setloginModal(false)}
        />

        {/* Transaction Modal */}
        <TransactionsModal
          setDragging={setDragging}
          modalVisible={buySellModal == true ? false : true}
          setModalVisible={setmodalVisible}
        >
          <div className="flex flex-row justify-between  ">
            <div
              onClick={() => setSelected("open")}
              className={`${
                selected == "open" ? "bg-[#f69320]" : "bg-gray-400"
              }  flex justify-center flex-grow  hover:opacity-90 cursor-pointer py-1 text-xs border-r border-gray-500 `}
            >
              <p className="font-semibold text-gray-700">
                Open ({openTransactions?.length})
              </p>
            </div>
            <div
              onClick={() => setSelected("pending")}
              className={`${
                selected == "pending" ? "bg-[#f69320]" : "bg-gray-400"
              }  flex justify-center flex-grow  hover:opacity-90 cursor-pointer py-1 text-xs border-r border-gray-500 `}
            >
              <p className="font-semibold text-gray-700">
                Pending ({pendingTransactions?.length})
              </p>
            </div>
            <div
              onClick={() => setSelected("close")}
              className={`${
                selected == "close" ? "bg-[#f69320]" : "bg-gray-400"
              }  flex justify-center flex-grow  hover:opacity-90 cursor-pointer py-1 text-xs `}
            >
              <p className="font-semibold text-gray-700">
                Close ({closeTransactions?.length})
              </p>
            </div>
          </div>
          {selected == "open" ? (
            <TransactionsTable
              type={"open"}
              data={openTransactions}
              handleCancel={() => setcloseAmountModal(true)}
              currentOpenAmount={stockData?.ask}
              refresh={_getTransactions}
            />
          ) : selected == "pending" ? (
            <TransactionsTable
              data={pendingTransactions}
              type="pending"
              currentOpenAmount={stockData?.[indexStock]?.["1. open"]}
            />
          ) : selected == "close" ? (
            <TransactionsTable
              type="close"
              data={closeTransactions?.slice(0, 20)}
              currentOpenAmount={stockData?.bid}
            />
          ) : null}
        </TransactionsModal>
      </div>
    </Main>
  );
};

export default Stock;

export async function getServerSideProps(context) {
  const userToken = context?.req?.cookies.userToken;
  const ticket = context.query.ticket;
  const ticket2 = context.query.ticket2;

  // if (userToken == null) {
  //   return {
  //     redirect: {
  //       destination: "/auth/login",
  //       permanent: false, // Set it to true if it's a permanent redirect
  //     },
  //   };
  // }

  return {
    props: {
      ticket,
      ticket2,
    },
  };
}
