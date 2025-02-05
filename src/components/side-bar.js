import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios, { all } from "axios";
import Environment from "@/constants/apiEndPoints";
import SocketComponent from "./SocketComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getForex,
  getMetals,
  getOils,
  getStocks,
} from "@/store/action/forexactions";
import _ from "lodash";

const { restClient } = require("@polygon.io/client-js");
// import { restClient } from "@polygon.io/client-js";

export default function Sidebar({ sidebar, setSideBar }) {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();

  const [isHoveredForex, setIsHoveredForex] = useState(true);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isForex, setIsForex] = useState(true);
  const [data, setData] = useState([]);
  const [forexData, setForexData] = useState([]);
  const [isStock, setisStock] = useState(true);
  const [isHoveredStock, setIsHoveredStock] = useState(true);

  const [allData, setAllData] = useState(
      {forex:[],metals:[],oil:[],stock:[]}

    );
  const [StockData, setStockData] = useState([
    { label: "IBM", value: "NYSE:IBM", ticket: "IBM" },
    { label: "APPLE", value: "NASDAQ:AAPL", ticket: "AAPL" },
    { label: "TESLA", value: "NASDAQ:TSLA", ticket: "TSLA" },
    { label: "GOOGLE", value: "NASDAQ:GOOG", ticket: "GOOGL" },
    { label: "FACEBOOK", value: "NASDAQ:META", ticket: "FB" },
    { label: "AMAZON", value: "NASDAQ:AMZN", ticket: "AMZN" },
  ]);
  const [isMetal, setisMetal] = useState(true);
  const [isHoveredMetal, setisHoveredMetal] = useState(true);
  const [metalData, setmetalData] = useState([
    { label: "GOLD", value: "TVC%3AGOLD", ticket: "XAUUSD" },
    { label: "SILVER", value: "NASDAQ%3ASSIC", ticket: "XAGUSD" },
    { label: "COPPER", value: "CAPITALCOM:COPPER", ticket: "CPPWF" },
    { label: "PLATINUM", value: "CAPITALCOM:PLATINUM", ticket: "XPTUSD" },
  ]);
  const [isOil, setIsOil] = useState(true);
  const [isHoveredOil, setIsHoveredOil] = useState(true);
  const [oilData, setOilData] = useState([
    { label: "US OIL", value: "TVC:USOIL", ticket: "OIL" },
    { label: "UK OIL", value: "TVC:UKOIL", ticket: "OILD" },
  ]);
  const [searchValue, setsearchValue] = useState("");
  const [searchIndexes, setsearchIndexes] = useState([]);

  const dispatch = useDispatch();

  // API KEY
  const rest = restClient("x5Vm09UZQ8XJpEL0SIgpKJxaROq8jgeQ");

  // useEffect(() => {
  //   // Open a WebSocket connection
  //   const socket = new WebSocket(
  //     "wss://stream.binance.com:9443/ws/!ticker@arr"
  //   );

  //   // Handle messages received from the server
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setData(data);
  //   };

  //   // Handle errors
  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   // Close the WebSocket connection when the component unmounts
  //   return () => {
  //     socket.close();
  //   };
  // }, []);
  // x5Vm09UZQ8XJpEL0SIgpKJxaROq8jgeQ

  // useEffect(() => {
  //   const ws = new WebSocket("wss://socket.polygon.io/forex");

  //   // Replace YOUR_POLYGON_API_KEY with your actual API key
  //   ws.onopen = () => {
  //     ws.send(
  //       `{"action": "auth", "params": "x5Vm09UZQ8XJpEL0SIgpKJxaROq8jgeQ"}`
  //     );

  //     // Subscribe to specific currency pairs (e.g., EUR/USD and GBP/USD)
  //     // ws.send('{"action":"subscribe", "params":"CA.*"}');
  //     ws.send('{"action":"subscribe", "params":"C.EUR/USD"}');
  //     ws.send('{"action":"subscribe", "params":"C.EUR/CAD"}');
  //     ws.send('{"action":"subscribe", "params":"C.EUR/JPY"}');
  //     ws.send('{"action":"subscribe", "params":"C.EUR/GBP"}');
  //   };

  //   // Handle messages received from the server
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.ev === "forex") {
  //       // Process the data here
  //       console.log("Forex data for", data.pair, ":", data);
  //     }
  //     // console.log("data ===>", data);
  //   };

  //   ws.onerror = (error) => {
  //     console.log("Forex Socket error ===>", error);
  //   };

  //   // Clean up the WebSocket connection when the component is unmounted
  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  function Forex() {
    rest.reference
      .tickers({ market: "fx", limit: 1000 })
      .then((data) => {
        console.log("data =====>", data);
        const filteredData = data?.results.filter((item) => {
          const symbol = item.ticker;
          return (
            symbol === "C:EURUSD" ||
            symbol === "C:EURCAD" ||
            symbol === "C:EURJPY" ||
            symbol === "C:EURGBP" ||
            symbol === "C:EURAUD" ||
            symbol === "C:EURNZD" ||
            symbol === "C:EURCHF" ||
            symbol === "C:EURXAU" ||
            symbol === "C:EURXAG" ||
            symbol === "C:GBPJPY" ||
            symbol === "C:GBPUSD" ||
            symbol === "C:GBPCHF" ||
            symbol === "C:GBPAUD" ||
            symbol === "C:GBPCAD" ||
            symbol === "C:GBPNZD" ||
            symbol === "C:GBPXAU" ||
            symbol === "C:GBPXAG" ||
            symbol === "C:AUDUSD" ||
            symbol === "C:AUDJPY" ||
            symbol === "C:AUDCAD" ||
            symbol === "C:AUDNZD" ||
            symbol === "C:AUDXAU" ||
            symbol === "C:AUDXAG" ||
            symbol === "C:USDJPY" ||
            symbol === "C:USDCAD" ||
            symbol === "C:USDCHF" ||
            symbol === "C:XNGUSD" ||
            symbol === "C:XAUUSD" ||
            symbol === "C:XAGUSD"
          );
        });
        // console.log("filteredData ===>", filteredData);
        setForexData(
          filteredData
          // data?.results.slice(
          //   Math.round(Math.random() * 1),
          //   Math.round(Math.random() * data?.results?.length)
          // )
        );
      })
      .catch((e) => {
        console.error("Forex Error ===>:", e);
      });
  }

  const getData = () => {
    axios
      .get(`${Environment.BASE_URL}data`)
      .then((res) => {
        if (res?.data?.data != undefined) {
          setAllData(res?.data?.data);
          dispatch(getForex(res?.data?.data?.forex));
          dispatch(getMetals(res?.data?.data?.metals));
          dispatch(getStocks(res?.data?.data?.stock));
          dispatch(getOils(res?.data?.data?.oil));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // function Stock() {
  //   axios
  //     .get(
  //       `${Environment.BASE_URL}stock?series=TIME_SERIES_DAILY&min=1&ticket=GOOG`
  //     )
  //     .then((res) => {
  //       console.log("res ========>", res);
  //     })
  //     .catch((error) => {
  //       console.log("e ===>", error);
  //     });
  // }

  // UQ3BUNG144VYUZWI
  useEffect(() => {
    getData();
  }, []);

  // Debounce the fetchData function
  // const debouncedFetchData = _.debounce(getData, 10000);

  // useEffect(() => {
  //   // Fetch data when the debouncedFetchData function is called
  //   debouncedFetchData();

  //   // Cleanup function to cancel any pending debounced calls when the component unmounts
  //   return () => {
  //     debouncedFetchData.cancel();
  //   };
  // }, []);

  useEffect(() => {
    // Forex();
    // Stock();
    const interval123 = setInterval(() => {
      getData();
    }, 100000);
    return () => clearInterval(interval123);
  }, []);

  // handle search
  const handelSearch = () => {
    const search1 = allData?.forex?.filter((x) =>
      x?.currency?.toLowerCase()?.includes(searchValue?.toLowerCase())
    );
    console.log("search", search1);
    if (search1?.length > 0) {
      setsearchIndexes(search1);
    }

    let tempArr = [
      ...(allData?.metals || []),
      ...(allData?.oil || []),
      ...(allData?.stock || []),
    ];
    const search2 = tempArr.filter((x) =>
      x?.currency?.toLowerCase()?.includes(searchValue)
    );
    if (search2?.length > 0) {
      setsearchIndexes(search2);
    }
  };

  useEffect(() => {
    handelSearch();
    if (searchValue?.length == 0) {
      setsearchIndexes([]);
    }
  }, [searchValue]);

  return (
    <>
      <nav
        className={`md:left-0 w-0 md:w-52 md:block md:fixed md:top-0 md:bottom-0 hover:md:overflow-y-scroll md:flex-row md:flex-nowrap md:overflow-hidden hidden sm:flex flex-wrap items-center justify-between transition-all ease-in-out duration-500 bg-gray-100  dark:bg-gray-900 shadow-2xl peer-checked:translate-x-0 z-10 py-4 px-2 relative`}
      >
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0  flex flex-wrap items-center justify-between w-full mx-auto ">
          {/* logo */}
          <div
            onClick={() => router.replace(`/forex/AUD-JPY`)}
            className="w-full   cursor-pointer mb-1"
          >
            <img src={"/newfx.png"} className="h-full  w-full" />
          </div>
          <SocketComponent />
          <p className="text-gray-100 text-lg text-center font-montserrat font-semibold uppercase">
            Web traders
          </p>
          {/* Search bar */}
          <form>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-800 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setsearchValue(e.target.value)}
                id="default-search"
                class="block w-full p-2 pl-10 placeholder:text-gray-400 text-sm text-gray-800 border border-gray-700 rounded-lg bg-gray-100 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                required
              />
            </div>
          </form>

          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {searchValue?.length == 0 ? (
              <>
                {/* FOREX */}
                <>
                  <div
                    onMouseEnter={() => {
                      setIsHoveredForex(false);
                    }}
                    onMouseLeave={() => {
                      setIsHoveredForex(true);
                    }}
                    onClick={() => setIsForex(!isForex)}
                    className="w-full py-2 px-4 bg-[#f69320] mt-2 text-sm font-medium font-montserrat text-black rounded-md cursor-pointer flex flex-row justify-between items-center"
                  >
                    <p>Forex ({"Total: " + allData?.forex?.length || 0})</p>
                    <Image
                      src={"/arrow.png"}
                      width={15}
                      height={15}
                      style={{ objectFit: "contain" }}
                      className={`${
                        isHoveredForex ? "hover:rotate-180" : "rotate-90"
                      } leading-none duration-500`}
                    />
                  </div>

                  {isForex &&
                    allData?.forex?.map((item, index) => {
                      const currency = item?.currency?.split("/");
                      return (
                        <div
                          key={index}
                          className="w-full py-2 bg-gray-100 dark:bg-gray-800 flex flex-row justify-between px-3 border-b-[1px] border-black cursor-pointer"
                          onClick={() =>
                            router.push(
                              // "/forex/" + item?.instrument
                              "/forex/" + currency[0] + "-" + currency[1]
                            )
                          }
                        >
                          <p
                            className={`text-sm 
                          text-green-500
                           font-medium font-montserrat`}
                          >
                            {currency[0] + " ➡ " + currency[1]}
                          </p>
                          <p
                            className={`text-sm 
                             text-red-500
                           font-medium font-montserrat`}
                          >
                            {item?.ask || 0}
                          </p>
                        </div>
                      );
                    })}
                </>

                {/* STOCK */}
                <>
                  <div
                    onMouseEnter={() => {
                      setIsHoveredStock(false);
                    }}
                    onMouseLeave={() => {
                      setIsHoveredStock(true);
                    }}
                    onClick={() => setisStock(!isStock)}
                    className="w-full py-2 px-3 bg-[#f69320] mt-2 text-sm font-medium font-montserrat text-black rounded-md cursor-pointer flex flex-row justify-between items-center"
                  >
                    <p>Stock ({"Total: " + allData?.stock?.length || 0})</p>
                    <Image
                      src={"/arrow.png"}
                      width={15}
                      height={15}
                      style={{ objectFit: "contain" }}
                      className={`${
                        isHoveredStock ? "rotate-180" : "rotate-90"
                      } leading-none duration-500`}
                    />
                  </div>

                  {isStock &&
                    allData?.stock?.map((item, index) => {
                      // console.log("item ==>", item.value);
                      return (
                        <div
                          key={index}
                          className="w-full py-2 bg-gray-100 dark:bg-gray-800 flex flex-row justify-between px-3 border-b-[1px] border-black cursor-pointer"
                          onClick={() =>
                            router.replace({
                              pathname: `/stock/${item.value}`,
                              query: {
                                ticket: `${item.ticket}`,
                                ticket2: `${item.currency}`,
                              },
                            })
                          }
                        >
                          <p
                            className={`text-sm 
                          text-green-500
                           font-medium font-montserrat`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-sm 
                             text-red-500
                           font-medium font-montserrat`}
                          >
                            {item?.ask || 0.0}
                          </p>
                        </div>
                      );
                    })}
                </>

                {/* METAL */}
                <>
                  <div
                    onMouseEnter={() => {
                      setisHoveredMetal(false);
                    }}
                    onMouseLeave={() => {
                      setisHoveredMetal(true);
                    }}
                    onClick={() => setisMetal(!isMetal)}
                    className="w-full py-2 px-3 bg-[#f69320] mt-2 text-sm font-medium font-montserrat text-black rounded-md cursor-pointer flex flex-row justify-between items-center"
                  >
                    <p>Metals ({"Total: " + allData?.metals?.length || 0})</p>
                    <Image
                      src={"/arrow.png"}
                      width={15}
                      height={15}
                      style={{ objectFit: "contain" }}
                      className={`${
                        isHoveredMetal ? "rotate-180" : "rotate-90"
                      } leading-none duration-500`}
                    />
                  </div>

                  {isMetal &&
                    allData?.metals?.map((item, index) => {
                      // console.log("item ==>", item.value);
                      return (
                        <div
                          key={index}
                          className="w-full py-2 bg-gray-100 dark:bg-gray-800 flex flex-row justify-between px-3 border-b-[1px] border-black cursor-pointer"
                          onClick={() =>
                            router.replace({
                              pathname: `/stock/${item.value}`,
                              query: {
                                ticket: item.ticket,
                                ticket2: `${item.currency}`,
                              },
                            })
                          }
                        >
                          <p
                            className={`text-sm 
                          text-green-500
                           font-medium font-montserrat`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-sm 
                             text-red-500
                           font-medium font-montserrat`}
                          >
                            {item?.ask || 0}
                          </p>
                        </div>
                      );
                    })}
                </>

                {/* OIL */}
                <>
                  <div
                    onMouseEnter={() => {
                      setIsHoveredOil(false);
                    }}
                    onMouseLeave={() => {
                      setIsHoveredOil(true);
                    }}
                    onClick={() => setIsOil(!isOil)}
                    className="w-full py-2 px-3 bg-[#f69320] mt-2 text-sm font-medium font-montserrat text-black rounded-md cursor-pointer flex flex-row justify-between items-center"
                  >
                    <p>Oils ({"Total: " + allData?.oil?.length || 0})</p>
                    <Image
                      src={"/arrow.png"}
                      width={15}
                      height={15}
                      style={{ objectFit: "contain" }}
                      className={`${
                        isHoveredOil ? "rotate-180" : "rotate-90"
                      } leading-none duration-500`}
                    />
                  </div>

                  {isOil &&
                    allData?.oil?.map((item, index) => {
                      // console.log("item ==>", item.value);
                      return (
                        <div
                          key={index}
                          className="w-full py-2 bg-gray-100 dark:bg-gray-800 flex flex-row justify-between px-3 border-b-[1px] border-black cursor-pointer"
                          onClick={() =>
                            router.replace({
                              pathname: `/stock/${item.value.toString()}`,
                              query: {
                                ticket: `${item.ticket}`,
                                ticket2: `${item.currency}`,
                              },
                            })
                          }
                        >
                          <p
                            className={`text-sm 
                          text-green-500
                           font-medium font-montserrat`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-sm 
                             text-red-500
                           font-medium font-montserrat`}
                          >
                            {item?.ask || 0}
                          </p>
                        </div>
                      );
                    })}
                </>
              </>
            ) : (
              <>
                {searchIndexes?.length > 0 ? (
                  <>
                    {searchIndexes.map((item, index) => {
                      let currency;
                      if (item.currency != undefined) {
                        currency = item.currency.split("/");
                      }
                      return (
                        <div
                          key={index}
                          className="w-full py-2 bg-gray-100 dark:bg-gray-800 flex flex-row justify-between px-5 border-b-[1px] border-black cursor-pointer"
                          onClick={() =>
                            item.label == undefined
                              ? router.push(
                                  // "/forex/" + item?.instrument
                                  "/forex/" + currency[0] + "-" + currency[1]
                                )
                              : router.replace({
                                  pathname: `/stock/${item.value}`,
                                  query: {
                                    ticket: `${item.ticket}`,
                                    ticket2: `${item.currency}`,
                                  },
                                })
                          }
                        >
                          <p
                            className={`text-sm 
                          text-green-500
                           font-medium font-montserrat`}
                          >
                            {item.label == undefined
                              ? currency[0] + " ➡ " + currency[1]
                              : item.label}
                          </p>
                          <p
                            className={`text-sm 
                             text-red-500
                           font-medium font-montserrat`}
                          >
                            ?
                          </p>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p className="text-blue-500 capitalize font-bold bg-[#f69320] px-4 py-2">
                      No records found...
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
