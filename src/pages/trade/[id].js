import React, { useState, useEffect, useRef, use } from "react";
import Main from "@/layout/Main";
import ScrollToTopButton from "@/utils/ScrollToTopButton";
import RateFilled from "@/components/rateFilled";
import moment from "moment";
import InputField from "@/components/inputs/InputField";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import BaseURL from "../../constants/apiEndPoints";
import Swal from "sweetalert2";

let tvScriptLoadingPromise;

const Home = ({ query }) => {
  const [trade, setTrade] = useState({});
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const user = useSelector((state) => state.userReducer.user);
  // console.log("user ===>", user);

  const [getUserBalance, setGetUserBalance] = useState(null);
  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      _getProfile();
    }
  }, []);

  const _getProfile = () => {
    axios
      .get(BaseURL.GET_PROFILE, {
        headers: {
          authorization: user.token,
        },
      })
      .then((res) => {
        console.log("GET_PROFILE ===>", res.data.data);
        setGetUserBalance(res.data.data.demoBalance);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [balance, setBalance] = useState("");

  useEffect(() => {
    // Open a WebSocket connection
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/ws/!ticker@arr"
    );

    // Handle messages received from the server
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let coin = data.filter((x) => x.s === query);
      if (coin.length !== 0) {
        setTrade(coin[0]);
        let openTime = new Date(coin[0].O);
        let closeTime = new Date(coin[0].O);
        setOpenTime(openTime);
        setCloseTime(closeTime);
      }
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Close the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

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
          width: 790,
          height: 530,
          symbol: query,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_legend: true,
          save_image: false,
          container_id: "tradingview_e4024",
        });
      }
    }
  }, []);

  const [orders, setOrders] = useState([
    { id: 3, name: "Pending", isActive: true },
    { id: 1, name: "Open", isActive: false },
    { id: 2, name: "Close", isActive: false },
  ]);

  const [options, setOptions] = useState([
    { id: 1, name: "Symbol", isActive: true },
    { id: 2, name: "Order ID", isActive: false },
    { id: 3, name: "Size", isActive: false },
    { id: 3, name: "Open Price", isActive: false },
  ]);
  const [values, setValues] = useState([
    { name: query, orderid: 123, size: 123123, openPrice: 123123 },
    { name: query, orderid: 123, size: 123123, openPrice: 123123 },
    { name: query, orderid: 123, size: 123123, openPrice: 123123 },
    { name: query, orderid: 123, size: 123123, openPrice: 123123 },
  ]);

  // Helper function to generate a random integer between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const _handleOrders = (updateItem) => {
    const tempArr = orders.map((item) => {
      if (updateItem.id === item.id) {
        if (updateItem.isActive) {
          return {
            ...item,
            isActive: true,
          };
        } else {
          return {
            ...item,
            isActive: true,
          };
        }
      } else {
        return {
          ...item,
          isActive: false,
        };
      }
    });
    setOrders(tempArr);
  };

  useEffect(() => {
    const updatedValues = values.map((item) => ({
      ...item,
      size: getRandomNumber(1, 10),
      openPrice: Number(trade.c),
    }));

    setValues(updatedValues);
  }, []);

  const filter = orders.filter((x) => x.isActive === true);

  const updateValue = () => {
    const updatedValues = values.map((item) => ({
      ...item,
      size: getRandomNumber(1, 100),
      openPrice: Number(trade.c),
    }));

    setValues(updatedValues);
  };

  const [isLoader, setIsLoader] = useState(false);
  const _handleBuySellCoin = (option) => {
    if (balance === "") {
    } else {
      setIsLoader(true);
      let params = {
        transactionAmount: Number(balance),
        accountTag: "demo",
        from: trade.s,
        to: "USDT",
        transactionType: option,
      };
      console.log("params ==>", params);
      axios
        .post(BaseURL.BUY_SELL_COIN, params, {
          headers: {
            authorization: user.token,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) {
            _getProfile();
            Swal.fire({
              icon: "success",
              title: "Transaction Successful",
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: res.data.message,
              showConfirmButton: false,
              timer: 2000,
            });
          }
          setIsLoader(false);
          setBalance("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {/* <div className="w-full flex items-center flex-col">
        <div className="w-full max-w-[1200px] min-h-screen px-4">
          <p className="text-4xl text-black font-semibold font-montserrat mt-12 mb-5">
            {trade.s}
          </p>
          <div className="flex flex-col sm:flex-row ">
            <div className="w-full overflow-x-auto  h-[550px] flex items-center justify-center">
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
            </div>
            <div className="ml-0 sm:ml-9 mt-12">
              <p className="text-gray-400 font-montserrat font-semibold">
                {trade.s}
              </p>
              <div className="flex my-3">
                <h1 className="text-4xl font-montserrat font-bold">
                  ${Number(trade.c).toFixed(2).toString()}
                </h1>
                <RateFilled change={trade.P} />
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="text-black text-sm font-montserrat font-semibold">
                  Total traded quote:
                </p>
                <p
                  className={`${
                    Number(trade.q) > 0 ? "text-green-600" : "text-red-600"
                  } text-sm font-montserrat font-medium`}
                >
                  {Number(trade.q).toFixed(2).toString()}
                </p>
              </div>
              {Object.keys(user).length !== 0 && (
                <>
                  <div className="flex flex-row items-center justify-between mt-5 sm:w-[300px]">
                    <div
                      className="bg-blue-500 hover:bg-blue-400 px-12 py-2 rounded-lg text-white font-montserrat font-semibold text-base cursor-pointer"
                      onClick={() => {
                        _handleBuySellCoin("buy");
                      }}
                    >
                      {isLoader ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <p>Buy</p>
                      )}
                    </div>
                    <div
                      className="bg-red-500 hover:bg-red-400 px-12 py-2 rounded-lg text-white font-montserrat font-semibold text-base cursor-pointer"
                      onClick={() => {
                        _handleBuySellCoin("sell");
                      }}
                    >
                      {isLoader ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <p>Sell</p>
                      )}
                    </div>
                  </div>
                  <InputField
                    label="Amount"
                    className="mt-2"
                    placeholder={`Amount in USDT`}
                    value={balance}
                    onChange={(e) => {
                      setBalance(e.target.value);
                    }}
                  />
                  <div className="mt-2 text-black font-montserrat font-semibold">
                    Balance: ${getUserBalance}
                  </div>
                </>
              )}

              <div className="bg-[#0a4c88]">
                <div className="w-full flex flex-row items-center justify-between mt-6">
                  {orders.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          item.isActive
                            ? "bg-[#f69320]"
                            : "bg-slate-400 hover:bg-slate-500"
                        } text-white text-sm w-full font-montserrat font-semibold py-2 cursor-pointer sm:w-[100px] border-[1px] border-white flex items-center justify-center`}
                        onClick={() => {
                          _handleOrders(item);
                          updateValue();
                        }}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>

                <div className="w-full flex flex-row items-center justify-between mt-1">
                  {options.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`text-[#f69320] text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
                {filter[0].id === 1 &&
                  values.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full flex flex-row items-center justify-between"
                      >
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {index + 1}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.size}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.openPrice}
                        </p>
                      </div>
                    );
                  })}
                {filter[0].id === 2 &&
                  values.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full flex flex-row items-center justify-between"
                      >
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {index + 1}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.size}
                        </p>
                        <p
                          className={`text-white text-xs font-montserrat font-semibold py-2 px-1 cursor-pointer`}
                        >
                          {item.openPrice}
                        </p>
                      </div>
                    );
                  })}
                {filter[0].id === 3 && (
                  <div className="flex items-center justify-center py-12 text-white text-base font-medium font-montserrat">
                    No Record Found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-8 justify-between mt-12 pr-0">
            <div className="w-full ">
              <div className="flex flex-row items-center justify-between my-2 w-full sm:w-[400px] ">
                <p className="text-black text-lg font-montserrat font-semibold flex-grow sm:flex-grow-0">
                  Price change:
                </p>
                <p
                  className={`${
                    Number(trade.p) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.p).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Weighted average price:
                </p>
                <p
                  className={`${
                    Number(trade.w) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.w).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2 w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Previous day's close price
                </p>
                <p
                  className={`${
                    Number(trade.x) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.x).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2 w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Close quote asset volume
                </p>
                <p
                  className={`${
                    Number(trade.Q) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.Q).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Best bid quantity
                </p>
                <p
                  className={`${
                    Number(trade.B) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.B).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Open price
                </p>
                <p
                  className={`${
                    Number(trade.o) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.o).toFixed(2).toString()}
                </p>
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-row items-center justify-between my-4 w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Total traded quote
                </p>
                <p
                  className={`${
                    Number(trade.q) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {Number(trade.q).toFixed(2).toString()}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2 w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  First trade ID
                </p>
                <p
                  className={`${
                    Number(trade.F) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {trade.F}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Last trade ID
                </p>
                <p
                  className={`${
                    Number(trade.L) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {trade.L}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Total number of trades
                </p>
                <p
                  className={`${
                    Number(trade.n) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {trade.n}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Open time
                </p>
                <p
                  className={`${
                    Number(trade.O) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
             
                  {moment(openTime).format("DD-MM-YYYY HH:mm:ss")}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between my-2  w-full sm:w-[400px]">
                <p className="text-black text-lg font-montserrat font-semibold">
                  Close time
                </p>
                <p
                  className={`${
                    Number(trade.C) > 0 ? "text-green-600" : "text-red-600"
                  } text-lg font-montserrat font-medium`}
                >
                  {moment(closeTime).format("DD-MM-YYYY HH:mm:ss")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ScrollToTopButton />
    </>
  );
};

export default Home;

Home.layout = Main;

export async function getServerSideProps(context) {
  const query = context.query.id;

  return {
    props: {
      query,
    },
  };
}
