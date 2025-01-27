import React, { useState, useEffect, useRef } from "react";
import Main from "@/layout/Main";
import ScrollToTopButton from "@/utils/ScrollToTopButton";
import axios from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import AccountTypeModal from "@/components/Modals/AccountTypeModal";
import BuySellModal from "@/components/Modals/BuySellModal";
import { useRouter } from "next/router";
import Environment from "@/constants/apiEndPoints";
import Swal from "sweetalert2";
import TransactionsTable from "../../components/TransactionsTable";
import TransactionsModal from "@/components/TransactionsModal";
import ForexTable from "@/components/ForexTable";
import InputField from "@/components/inputs/InputField";
import PageLoader from "@/components/PageChange";
import { handleSubAccount } from "@/store/action/accountActions";

let tvScriptLoadingPromise;

export default function Home({ query, currency }) {
  // console.log("currencyData ==========>", currencyData);

  // router
  const router = useRouter();

  // dispatch
  const dispatch = useDispatch();

  // states
  const [buySellModal, setBuySellModal] = useState(false);
  const [paymentType, setPaymentType] = useState("buy");
  const [amount, setamount] = useState(0.1);
  const [modalVisible, setmodalVisible] = useState(false);
  const [selected, setSelected] = useState("open");
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const user = useSelector((state) => state.userReducer);
  const [allTransactions, setallTransactions] = useState([]);
  const [forexData, setforexData] = useState([]);
  const [closeAmountModal, setcloseAmountModal] = useState(false);
  const [shortAmount, setShortAmount] = useState(0.1);
  const [loading, setloading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const forexRed = useSelector((state) => state.forexReducer);

  // state for buy/selling forex
  const [sellState, setSellState] = useState({
    from: currency[0], // it fixed because we have balance in our account is in USD
    to: currency[1],
    unit: amount,
    subAccId: subUser?._id,
    orderType: "buy",
    stopLoss: 0,
    profitLimit: 0,
    openAmount: forexData?.bid,
  });

  // state for pending data
  const [pendingState, setpendingState] = useState({
    from: currency[0], // it fixed because we have balance in our account is in USD
    to: currency[1],
    unit: amount,
    subAccId: subUser?._id,
    orderType: "buy",
    stopLoss: 0,
    profitLimit: 0,
    openAmount: forexData?.ask,
    // price: forexData?.ask,
    status: "pending",
  });
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_e4024") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          width: screen.width - 300,
          height: screen.availHeight * 0.7,
          symbol: currency[0] + currency[1],
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: true,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          hide_legend: false,
          save_image: false,
          container_id: "tradingview_e4024",
        });
      }
    }
  }, []);

  useEffect(() => {
    setSellState({
      ...sellState,
      openAmount: forexData?.ask,
    });
    setpendingState({
      ...pendingState,
      openAmount: forexData?.ask,
    });
  }, [forexRed]);

  // const exchangeRateData = currencyData["Realtime Currency Exchange Rate"];
  // const fromCurrencyCode = exchangeRateData["1. From_Currency Code"];
  // const fromCurrencyName = exchangeRateData["2. From_Currency Name"];
  // const toCurrencyCode = exchangeRateData["3. To_Currency Code"];
  // const toCurrencyName = exchangeRateData["4. To_Currency Name"];
  // const exchangeRate = exchangeRateData["5. Exchange Rate"];
  // const lastRefreshed = exchangeRateData["6. Last Refreshed"];
  // const timeZone = exchangeRateData["7. Time Zone"];
  // const bidPrice = exchangeRateData["8. Bid Price"];
  // const askPrice = exchangeRateData["9. Ask Price"];

  // config
  const config1 = {
    headers: {
      Authorization: user.user.token,
    },
  };

  // Logging the extracted values
  // console.log("From Currency Code:", fromCurrencyCode);
  // console.log("From Currency Name:", fromCurrencyName);
  // console.log("To Currency Code:", toCurrencyCode);
  // console.log("To Currency Name:", toCurrencyName);
  // console.log("Exchange Rate:", exchangeRate);
  // console.log("Last Refreshed:", lastRefreshed);
  // console.log("Time Zone:", timeZone);
  // console.log("Bid Price:", bidPrice);
  // console.log("Ask Price:", askPrice);

  // const [orders, setOrders] = useState([
  //   { id: 3, name: "Pending", isActive: true },
  //   { id: 1, name: "Open", isActive: false },
  //   { id: 2, name: "Close", isActive: false },
  // ]);

  // const [options, setOptions] = useState([
  //   { id: 1, name: "Symbol", isActive: true },
  //   { id: 2, name: "Order ID", isActive: false },
  //   { id: 3, name: "Size", isActive: false },
  //   { id: 3, name: "Open Price", isActive: false },
  // ]);
  // const [values, setValues] = useState([
  //   { name: query, orderid: 123, size: 123123, openPrice: 123123 },
  //   { name: query, orderid: 123, size: 123123, openPrice: 123123 },
  //   { name: query, orderid: 123, size: 123123, openPrice: 123123 },
  //   { name: query, orderid: 123, size: 123123, openPrice: 123123 },
  // ]);

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
  // pending
  const pendingTransactions = allTransactions.pending;
  // open
  const openTransactions = allTransactions?.open;

  // close
  const closeTransactions = allTransactions?.close;
  console.log("closeTransactions", closeTransactions);
  // Helper function to generate a random integer between min and max (inclusive)
  // const getRandomNumber = (min, max) => {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };

  // const _handleOrders = (updateItem) => {
  //   const tempArr = orders.map((item) => {
  //     if (updateItem.id === item.id) {
  //       if (updateItem.isActive) {
  //         return {
  //           ...item,
  //           isActive: true,
  //         };
  //       } else {
  //         return {
  //           ...item,
  //           isActive: true,
  //         };
  //       }
  //     } else {
  //       return {
  //         ...item,
  //         isActive: false,
  //       };
  //     }
  //   });
  //   setOrders(tempArr);
  // };

  // get some forex data
  const getSomeForexData = () => {
    axios
      .get(`${Environment.BASE_URL}stock?ticket=${query?.replace("-", "")}`)
      .then((res) => {
        // console.log("res ==>", res?.data);
        setforexData(res?.data?.data);
      })
      .catch((err) => {
        console.log("getSomeForexData =====>", err);
      });
  };

  useEffect(() => {
    getSomeForexData();
    // const updatedValues = values.map((item) => ({
    //   ...item,
    //   size: getRandomNumber(1, 10),
    //   openPrice: 1.241,
    // }));

    // setValues(updatedValues);
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

  // const updateValue = () => {
  //   const updatedValues = values.map((item) => ({
  //     ...item,
  //     size: getRandomNumber(1, 100),
  //     openPrice: 1.93,
  //   }));

  //   setValues(updatedValues);
  // };

  // const handleChange
  const handleChangeInput = (name, value, state, setState) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  // handle buy sell submit
  const handleBuySellSubmit = (e) => {
    e.preventDefault();
    const newState = { ...sellState, unit: Number(sellState.unit) };
    console.log("new ==>", newState);

    if (newState.unit == 0) {
      Swal.fire({
        title: "Forex Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      setloading(true);
      // console.log("sellState ==>", sellState);
      axios
        .post(`${Environment.BASE_URL}forex/open`, newState, config1)
        .then((res) => {
          setloading(false);
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              console.log("res2 ===>", res2);

              if (res2?.data?.data != undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
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
              console.log("user/me error ==>", err2);
            });
        })
        .catch((error) => {
          console.log("handleBuySellSubmit ==>", error);
          setloading(false);
          Swal.fire({
            title: error.message || "Something went wrong",
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

  // handle buy sell submit
  const handlePendingSubmit = (e) => {
    console.log("pending ==>", pendingState);
    e.preventDefault();
    if (pendingState.amount == 0) {
      Swal.fire({
        title: "Forex Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      setloading(true);
      axios
        .post(`${Environment.BASE_URL}forex/open`, pendingState, config1)
        .then((res) => {
          setloading(false);
          axios
            .get(`${Environment.BASE_URL}user/me/${subUser?._id}`, config1)
            .then((res2) => {
              if (res2?.data?.data != undefined) {
                dispatch(handleSubAccount(res2?.data?.data));
              }
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
              console.log("handleBuySellSubmit error ==>", err2);
            });
        })
        .catch((error) => {
          console.log("sell ==>", error);
          setloading(false);
          Swal.fire({
            title: error.message,
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

  useEffect(() => {
    _getTransactions();
  }, [selected, modalVisible, closeAmountModal]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getSomeForexData();

      // setopenAmount(stockData[newIndex]?.["1. open"]);
    }, 100000);
    return () => clearInterval(intervalId);
  }, []);

  // handle short buy sell
  const _handleShortBuySell = (e, type) => {
    e.preventDefault();
    let params = {
      from: currency[0], // it fixed because we have balance in our account is in USD
      to: currency[1],
      unit: shortAmount,
      subAccId: subUser?._id,
      orderType: type,
      openAmount: forexData?.ask,
    };

    if (shortAmount == 0) {
      Swal.fire({
        title: "Forex Unit must be greater than Zero",
        icon: "error",
        timer: 3000,
      });
    } else {
      console.log(params);
      setloading(true);
      axios
        .post(`${Environment.BASE_URL}forex/open`, params, config1)
        .then((res) => {
          console.log("this is open api", res.data);
          console.log(
            "this is me api",
            `${Environment.BASE_URL}user/me/${subUser?._id}`,
            config1
          );

          fetch(`${Environment.BASE_URL}user/me/${subUser._id}`, config1)
            .then((res) => res.json())
            .then((meres) => {
              console.log("this is mee api", meres);

              if (meres?.data !== undefined) {
                dispatch(handleSubAccount(meres?.data));
              }

              Swal.fire({
                title: res?.data?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              })
                .then((Res) => {
                  if (Res.isConfirmed || Res.isDismissed) {
                    setBuySellModal(false);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((error) => {
          console.log("error short buy sell ==>", error);
          setloading(false);
          Swal.fire({
            title: error.message,
            icon: "error",
          }).then((Res) => {
            if (Res.isConfirmed || Res.isDismissed) {
              setBuySellModal(false);
            }
          });
        })
        .finally(() => {
          _getTransactions();

          // axios
          //   .get(`${Environment.BASE_URL}user/me/${subUser._id}`, config1)
          //   .then((meres) => {
          //     if (meres?.data?.data !== undefined) {
          //       dispatch(handleSubAccount(meres?.data?.data));
          //     }
          //     console.log("this is mee api", meres);
          //     setloading(false);

          //     _getTransactions();
          //   })
          //   .catch((err2) => {
          //     console.log(err2);
          //   });
        });
    }
  };

  return (
    <Main>
      <div className="w-full bg-gray-100 dark:bg-gray-800  flex items-center flex-col relative ">
        <div className="w-full  min-h-screen px-4">
          <div className="flex flex-col sm:flex-row w-full ">
            {/* Chart */}
            <div
              className={`z-0 overflow-x-auto relative ${
                dragging && "pointer-events-none"
              } w-full`}
            >
              <div className="w-full  flex flex-col items-center mt-5">
                <div className="tradingview-widget-container">
                  <div id="tradingview_e4024" />
                  <div className="tradingview-widget-copyright">
                    <a
                      href="https://www.tradingview.com/"
                      rel="noopener nofollow"
                      target="_blank"
                    ></a>
                  </div>
                </div>

                <div className="flex flex-row justify-center absolute right-20 top-6 items-center ">
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
                        {forexData?.bid}
                      </span>
                    </p>
                    <input
                      type={"number"}
                      name={"amount"}
                      step={0.01}
                      min={0.01}
                      max={1}
                      className={`bg-gray-50 text-center border-gray-300 text-gray-900 text-xs focus:outline-none font-montserrat  focus:ring-blue-500 focus:border-blue-500 block w-4/12 p-2`}
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
                        {forexData?.ask}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-center absolute left-10 top-6 items-center ">
                  {/* new orders */}
                  <p
                    onClick={() => {
                      if (Object.keys(subUser).length >= 1) {
                        setBuySellModal(true);

                        setSellState({
                          ...sellState,
                          orderType: "buy",
                        });
                      } else {
                        router.push("/accounts");
                      }
                    }}
                    className="px-5 py-2 h-fit uppercase text-xs cursor-pointer bg-[#f69320] font-bold text-gray-700 w-fit rounded"
                  >
                    + New Order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Buy Sell Modal */}
        <BuySellModal
          modalVisible={buySellModal}
          title={currency[0] + "➞" + currency[1] || ""}
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

              <p className="text-green-500 px-1 text-xs rounded bg-green-100 font-semibold uppercase">
                {forexData?.ask}
              </p>
            </div>
            {/* pending */}
            <div
              onClick={() => {
                setPaymentType("pending");
                setSellState({
                  ...sellState,
                  orderType: "pending",
                });
              }}
              className={` flex flex-col items-center border-x border-white justify-center flex-grow py-1 cursor-pointer hover:opacity-90 ${
                paymentType == "pending" ? "bg-[#0a4c88]" : "bg-gray-400"
              } `}
            >
              <p className="text-white font-semibold uppercase">pending</p>
              <p className="text-red-600 text-xs px-1 rounded bg-red-100 font-semibold uppercase">
                {forexData?.ask}
              </p>
            </div>
            {/* sell */}
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
                {forexData?.bid}
              </p>
            </div>
          </div>

          {paymentType == "buy" ? (
            <div className="flex flex-row justify-center  flex-wrap w-full px-4">
              <form
                onSubmit={(e) => handleBuySellSubmit(e)}
                className="flex flex-row justify-center gap-1 flex-wrap w-full px-4"
              >
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Size
                  </label>
                  <input
                    value={sellState.unit}
                    step={0.01}
                    min={0.01}
                    max={1}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value > 1
                          ? 1
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    name="unit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Forex
                  </label>
                  <input
                    value={currency[0] + "➞" + currency[1] || ""}
                    disabled={true}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    take profit
                  </label>
                  <input
                    value={sellState.profitLimit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    step={0.1}
                    name="profitLimit"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>

                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stop loss
                  </label>
                  <input
                    value={sellState.stopLoss}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  onClick={(e) => handleBuySellSubmit(e)}
                  className="text-white w-11/12 uppercase mt-3 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  p-1 text-center"
                  type="submit"
                >
                  Buy
                </button>
              </form>
            </div>
          ) : paymentType == "sell" ? (
            <div className="flex flex-row justify-center    flex-wrap w-full px-4">
              <form
                className="flex flex-row justify-center gap-1 flex-wrap w-full px-4"
                onSubmit={(e) => handleBuySellSubmit(e)}
              >
                <div className="flex flex-col w-11/12">
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
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    name="unit"
                    step={0.01}
                    min={0.01}
                    max={1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Forex
                  </label>
                  <input
                    value={currency[0] + "➞" + currency[1] || ""}
                    disabled={true}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    take profit
                  </label>
                  <input
                    value={sellState.profitLimit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    name="profitLimit"
                    type="number"
                    step={0.1}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stop loss
                  </label>
                  <input
                    value={sellState.stopLoss}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        sellState,
                        setSellState
                      );
                    }}
                    name="stopLoss"
                    type="number"
                    step={0.1}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  className="text-white w-11/12 uppercase mt-2 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  p-1 text-center"
                  type="submit"
                  onClick={(e) => handleBuySellSubmit(e)}
                >
                  Sell
                </button>
              </form>
            </div>
          ) : paymentType == "pending" ? (
            <div className="flex flex-row justify-center  flex-wrap w-full px-4">
              <form
                className="flex flex-row justify-center gap-1 flex-wrap w-full px-4"
                onSubmit={(e) => handlePendingSubmit(e)}
              >
                {/* <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    value={sellState.amount}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="amount"
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
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
                    class="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  >
                    <option selected value="buy">
                      Buy Limit
                    </option>
                    <option value="sell">Sell Limit </option>
                    {/* <option value="Buy Stop">Buy Stop </option>
                    <option value="Sell Stop">Sell Stop </option> */}
                  </select>
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Size
                  </label>
                  <input
                    value={pendingState.unit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value > 1
                          ? 1
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="unit"
                    step={0.01}
                    min={0.01}
                    max={1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col  w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Expected Price
                  </label>
                  <input
                    value={pendingState.openAmount}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="openAmount"
                    step={0.1}
                    type="number"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    Forex
                  </label>
                  <input
                    value={currency[0] + "➞" + currency[1] || ""}
                    disabled={true}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    take profit
                  </label>
                  <input
                    value={pendingState.profitLimit}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="profitLimit"
                    type="number"
                    step={0.1}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <label
                    for="first_name"
                    class="block  text-sm uppercase font-medium text-gray-900 dark:text-white"
                  >
                    stop loss
                  </label>
                  <input
                    value={pendingState.stopLoss}
                    onChange={(e) => {
                      const newValue =
                        e.target.value < 0
                          ? 0
                          : e.target.value.replace(/^0+(?=\d)/, "");
                      handleChangeInput(
                        e.target.name,
                        newValue,
                        pendingState,
                        setpendingState
                      );
                    }}
                    name="stopLoss"
                    type="number"
                    step={0.1}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  />
                </div>
                <button
                  className="text-white w-11/12  uppercase mt-2 bg-[#f69320] hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#f69320] font-medium rounded-lg text-lg  p-1 text-center"
                  type="submit"
                  onClick={(e) => handlePendingSubmit(e)}
                >
                  Pending
                </button>
              </form>
            </div>
          ) : null}
        </BuySellModal>

        {/* Transaction Modal */}
        <TransactionsModal
          modalVisible={buySellModal == true ? false : true}
          setModalVisible={setmodalVisible}
          setDragging={setDragging}
        >
          <div className="flex flex-row justify-between   ">
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
            <ForexTable
              refresh={_getTransactions}
              type={"open"}
              data={openTransactions}
              closeAmountModal={closeAmountModal}
              setcloseAmountModal={setcloseAmountModal}
              currentOpenAmount={forexData?.ask}
            />
          ) : selected == "pending" ? (
            <ForexTable
              data={pendingTransactions}
              closeAmountModal={closeAmountModal}
              setcloseAmountModal={setcloseAmountModal}
              currentOpenAmount={forexData?.ask}
              type={"pending"}
            />
          ) : selected == "close" ? (
            <ForexTable
              type="close"
              data={closeTransactions?.slice(0, 20)}
              closeAmountModal={closeAmountModal}
              setcloseAmountModal={setcloseAmountModal}
              currentOpenAmount={forexData?.ask}
            />
          ) : null}
        </TransactionsModal>

        {/* Update Modal */}
      </div>

      <ScrollToTopButton />
    </Main>
  );
}

export async function getServerSideProps(context) {
  const query = context.query.id;
  console.log(query);
  let currency = query.split("-");
  let currencyData;
  const userToken = context?.req?.cookies.userToken;
  // console.log(currency[0]);
  // console.log(currency[1]);
  // https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo

  // let data = axios(
  //
  // )
  //   .then((res) => {
  //     console.log(res.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // if (userToken == null) {
  //   return {
  //     // redirect: {
  //     //   destination: "/auth/login",
  //     //   permanent: false, // Set it to true if it's a permanent redirect
  //     // },
  //   };
  // } else {
  // try {
  //   const response = await axios.get(
  //     `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency[0]}&to_currency=${currency[1]}&apikey=6K52FNQQXJYHBBWT`
  //   );
  //   currencyData = response.data;
  // } catch (err) {
  //   console.log(err);
  // }
  // }

  return {
    props: {
      query,
      currency,
    },
  };
}
