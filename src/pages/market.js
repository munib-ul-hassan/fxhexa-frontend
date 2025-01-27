import React, { useState, useEffect } from "react";
import Main from "@/layout/Main";
import ScrollToTopButton from "@/utils/ScrollToTopButton";
import Image from "next/image";
import Table from "../components/Table";
import InputField from "@/components/inputs/InputField";

export default function Home({}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Open a WebSocket connection
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/ws/!ticker@arr"
    );

    // Handle messages received from the server
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Do something with the received data
      //   console.log("WebSocket ===>", data);
      setData(data);
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

  const BTCUSDT = data.filter((x) => x.s === "BTCUSDT");
  const ETHUSDT = data.filter((x) => x.s === "ETHUSDT");
  const LTCUSDT = data.filter((x) => x.s === "LTCUSDT");
  const BNBUSDT = data.filter((x) => x.s === "BNBUSDT");
  const DOGEUSDT = data.filter((x) => x.s === "DOGEUSDT");
  const XRPUSDT = data.filter((x) => x.s === "XRPUSDT");
  const SOLUSDT = data.filter((x) => x.s === "SOLUSDT");

  const [search, setSearch] = useState("");
  const handleSearchInputChange = (text) => {
    setSearch(text.target.value);
    console.log("text ==>", text.target.value);
  };

  return (
    <>
      <div className="w-full flex items-center flex-col ">
        <div className="w-full max-w-[1200px] min-h-screen px-4">
          <div className="mt-12 justify-between">
            <p className="text-3xl sm:text-4xl text-black font-semibold font-montserrat">
              Market Overview:
            </p>
          </div>
          <div className="py-5 flex justify-between flex-col items-center sm:flex-row space-y-5 sm:space-y-0">
            <div>
              <p className="text-slate-800 text-base font-montserrat font-medium mb-2">
                Hot Coin:
              </p>
              <div className="w-[300px] py-4 bg-slate-100 justify-between px-4 rounded-lg">
                <div>
                  {BTCUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {BTCUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(BTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(BTCUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(BTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(BTCUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}

                  {ETHUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {ETHUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(ETHUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(ETHUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(ETHUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(ETHUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                  {LTCUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {LTCUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(LTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(LTCUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`text-sm ${
                          Number(LTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } font-montserrat font-medium`}
                      >
                        {Number(LTCUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-800 text-base font-montserrat font-medium mb-2">
                Top Gainer:
              </p>
              <div className="w-[300px] py-4 bg-slate-100 justify-between px-4 rounded-lg">
                <div>
                  {BNBUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {BNBUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(BNBUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(BNBUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(BNBUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(BNBUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}

                  {DOGEUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {DOGEUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(DOGEUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(DOGEUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(DOGEUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(DOGEUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                  {XRPUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {XRPUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(XRPUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(XRPUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(XRPUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(XRPUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-800 text-base font-montserrat font-medium mb-2">
                Top Volume:
              </p>
              <div className="w-[300px] py-4 bg-slate-100 justify-between px-4 rounded-lg">
                <div>
                  {SOLUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {SOLUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(SOLUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(SOLUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(SOLUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(SOLUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                  {BTCUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {BTCUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(BTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(BTCUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(BTCUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(BTCUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                  {ETHUSDT.length !== 0 && (
                    <div className="flex flex-row justify-between py-1 px-4">
                      <p
                        className={`text-black text-sm font-montserrat font-medium`}
                      >
                        {ETHUSDT[0]?.s}
                      </p>
                      <p
                        className={`${
                          Number(ETHUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        ${Number(ETHUSDT[0]?.c).toFixed(2).toString()}
                      </p>
                      <p
                        className={`${
                          Number(ETHUSDT[0]?.P) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm font-montserrat font-medium`}
                      >
                        {Number(ETHUSDT[0]?.P).toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex my-3 justify-center sm:justify-end mb-8 ">
            <InputField
              className="w-[300px]"
              label="Search"
              value={search}
              placeholder="Search Here"
              onChange={handleSearchInputChange}
            />
          </div>
          <p className="text-black text-lg font-montserrat font-semibold">
            Top Tokens by Market Capitalization:
          </p>
          <p className="text-slate-500 text-base font-montserrat font-medium">
            Get a comprehensive snapshot of all cryptocurrencies available on
            FX-HEXA. This page displays the latest prices, 24-hour trading
            volume, price changes, and market capitalizations for all
            cryptocurrencies on FX-HEXA. Users can quickly access key
            information about these digital assets and access the trade page
            from here. The data presented is for informational purposes only.
            Some data is provided by CoinMarketCap and is shown on an “as is”
            basis, without representation or warranty of any kind. Please view
            our General Risk Warning for more information.
          </p>
          <Table data={data} />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

Home.layout = Main;
