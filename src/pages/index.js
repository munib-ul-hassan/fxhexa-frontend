import React, { useState, useEffect } from "react";
import Main from "@/layout/Main";
import ScrollToTopButton from "@/utils/ScrollToTopButton";
import Image from "next/image";
import Table from "../components/Table";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home({}) {
  const [data, setData] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  // router
  const router = useRouter();

  useEffect(() => {
    router.replace(`/forex/EUR-USD`);
  }, []);

  // useEffect(() => {
  //   // Open a WebSocket connection
  //   const socket = new WebSocket(
  //     "wss://stream.binance.com:9443/ws/!ticker@arr"
  //   );

  //   // Handle messages received from the server
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     // Do something with the received data
  //     // console.log("WebSocket ===>", data);
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

  return (
    <>
      <div className="w-full flex items-center flex-col">
        {Object.keys(user).length === 0 && (
          <div className="bg-[#f69320] flex items-center justify-center py-3 px-5 w-full mt-5">
            <p className="text-slate-800 text-sm font-medium font-montserrat">
              Register now - Get up to 100 USDT in trading fee rebate (for
              verified users)
            </p>
          </div>
        )}
        <div className="w-full max-w-[1200px] min-h-screen px-1">
          <div className="flex flex-row mt-12 justify-between pr-0 sm:pr-28">
            <div className="w-full sm:w-[600px] ">
              <p className="text-3xl sm:text-5xl ml-5 sm:ml-0 text-black font-semibold font-montserrat">
                Buy, trade, and hold 350+ cryptocurrencies on FX Hexa
              </p>
              <div className="flex flex-row items-center mt-5 ml-5 sm:ml-0">
                <Image
                  src={"/gift.png"}
                  width={25}
                  height={25}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p className="text-xl text-slate-800 ml-3">
                  Trade Bitcoin for free
                </p>
              </div>
              {Object.keys(user).length === 0 && (
                <div className="mt-5 bg-[#f69320] w-10/12 sm:w-fit  py-3 px-0 sm:px-16 mx-auto sm:mx-0 rounded-md flex flex-row justify-center items-center">
                  <Image
                    src={"/user.png"}
                    width={19}
                    height={19}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  <p className="text-black font-medium font-montserrat text-base ml-3">
                    Sign up with Email or Phone
                  </p>
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <Image
                src={"/crypto.png"}
                width={300}
                height={300}
                className="rounded-lg mb-2"
                style={{
                  objectFit: "contain",
                }}
              />
              <Image
                src={"/crypto1.jpeg"}
                width={300}
                height={300}
                className="rounded-lg ml-16"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-y-8 sm:gap-y-0 justify-between items-center mt-12">
            <div>
              <p className="text-black text-3xl font-semibold font-montserrat">
                $38 billion
              </p>
              <p className="text-black text-base font-montserrat font-base w-[190px]">
                Cryptocurrencies listed
              </p>
            </div>
            <div>
              <p className="text-black text-3xl font-semibold font-montserrat">
                350+
              </p>
              <p className="text-black text-base font-montserrat font-base w-[190px]">
                24h trading volume on Binance exchange
              </p>
            </div>
            <div>
              <p className="text-black text-3xl font-semibold font-montserrat">
                140 million
              </p>
              <p className="text-black text-base font-montserrat font-base w-[190px]">
                Registered users
              </p>
            </div>
            <div>
              <p className="text-black text-3xl font-semibold font-montserrat">
                {"Users<0.10%"}
              </p>
              <p className="text-black text-base font-montserrat font-base w-[190px]">
                Lowest transaction fees
              </p>
            </div>
          </div>
          <Table data={data.slice(0, 10)} />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

Home.layout = Main;

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/forex/EUR-USD",
      permanent: false, // Set it to true if it's a permanent redirect
    },
  };

  return {
    props: {},
  };
}
