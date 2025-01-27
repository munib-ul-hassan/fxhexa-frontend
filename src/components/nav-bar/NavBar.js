import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/action/cartAction";
import { useRef } from "react";

import detectEthereumProvider from "@metamask/detect-provider";
// import Web3 from "web3";
import Environment from "@/constants/apiEndPoints";

const maxWidthOFContent = 1400;
const NavBar = ({
  stateMetaMask,
  setMetaMask,
  accountSidebarOpen,
  setaccountSidebarOpen,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);
  const admin = useSelector((state) => state.userReducer.admin);
  const [isMenu, setIsMenu] = useState(false);
  const [dotMenu, setDotMenu] = useState(false);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);

  let data = [
    {
      name: "Market",
      route: "/market",
    },
    // {
    //   name: "Trade",
    // },
    // {
    //   name: "Derivatives",
    // },
    // {
    //   name: "More",
    // },
  ];

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // const initMetaMask = async () => {
  //   try {
  //     const provider = await detectEthereumProvider();
  //     console.log("provider ==>", provider);
  //     if (provider) {
  //       // MetaMask is installed
  //       const web3Instance = new Web3(provider);
  //       setWeb3(web3Instance);
  //       console.log("web3Instance ===>", web3Instance);

  //       // You can now use the web3 instance to interact with the Ethereum blockchain.
  //       // For example, you can get the user's accounts:
  //       const accounts = await web3Instance.eth.getAccounts();
  //       if (accounts.length === 0) {
  //         connectWallet();
  //       }
  //       setAccounts(accounts);
  //       console.log("accounts ==>", accounts);
  //     } else {
  //       console.log("MetaMask not found. Please install MetaMask extension.");

  //       setMetaMask(true);
  //     }
  //   } catch (error) {
  //     console.error("Error while initializing MetaMask:", error);
  //   }
  // };

  // const connectWallet = async () => {
  //   try {
  //     if (web3 && !isConnecting) {
  //       setIsConnecting(true);
  //       const accounts = await web3.eth.requestAccounts();
  //       setAccounts(accounts);
  //       setIsConnecting(false);
  //       router.reload();
  //     } else {
  //       console.log(
  //         "Web3 is not initialized or already connecting. Make sure MetaMask is installed and connected."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error while connecting wallet:", error);
  //     setIsConnecting(false);
  //   }
  // };

  const catMenu = useRef(null);
  const closeOpenMenus = (e) => {
    if (catMenu.current && dotMenu && !catMenu.current.contains(e.target)) {
      setDotMenu(false);
    }
  };

  const catMenu2 = useRef(null);
  const closeOpenMenus2 = (e) => {
    if (catMenu2.current && isMenu && !catMenu2.current.contains(e.target)) {
      setIsMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeOpenMenus);
    document.addEventListener("click", closeOpenMenus2);
  }, [dotMenu, isMenu]);

  return (
    <>
      <div className="  flex flex-col items-center px-10 w-full bg-[#1a2330]">
        <nav
          style={{
            maxWidth: maxWidthOFContent,
          }}
          className={`flex-row  w-full flex justify-between md:flex-row text-[#D3DCE1] items-center mt-4`}
        >
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={"/Logo.png"}
              width={260}
              height={130}
              className="cursor-pointer w-24 h-24"
              style={{
                objectFit: "contain",
              }}
              onClick={() => {
                router.push("/");
              }}
            />
            {Object?.keys(user).length >= 1 && (
              <>
                {/* <div
              onClick={() => router.replace("/coin/coins")}
              className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
            >
              Coins
            </div> */}
                {/* <div
              onClick={() => router.replace("/transactions/transactions")}
              className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
            >
              Transactions
            </div> */}
                <div
                  onClick={() => router.replace("/transaction/alltransactions")}
                  className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
                >
                  Transactions
                </div>

                <div
                  onClick={() => router.replace("/withdraw/withdraw")}
                  className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
                >
                  Withdraw
                </div>

                <div
                  onClick={() => router.replace("/withdraw/withdraw")}
                  className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
                >
                  Deposit
                </div>

                <div
                  onClick={() => router.replace("/referral")}
                  className="text-[#f69320] font-montserrat font-medium text-md cursor-pointer hover:border-b  p-2 border-[#f69320]"
                >
                  Referral
                </div>
              </>
            )}
          </div>

          <div className="flex flex-row justify-between items-center ">
            {Object.keys(subUser).length > 0 && (
              <>
                <div className="mx-4" ref={catMenu2}>
                  <button
                    onClick={() => {
                      setIsMenu(!isMenu);
                      setDotMenu(false);
                    }}
                    class="flex items-center justify-between w-full py-2 pl-3 pr-4 text-[#f69320] font-montserrat  font-semibold text-xl border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 "
                  >
                    $ {subUser?.balance.toFixed(2)} USD
                    <svg
                      class="w-2.5 h-2.5 ml-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <div
                    class={`absolute right-10 z-10  ${
                      isMenu ? " grid " : " hidden "
                    } w-auto grid-cols-2 text-sm bg-gray-700 border border-gray-600 rounded-lg shadow-md md:grid-flow-row md:grid-rows-2 px-4`}
                  >
                    <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row border-b border-gray-100 ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-300 text-sm font-arial font-semibold mb-3 uppercase">
                          ACCOUNT
                        </h6>
                        <p className="text-gray-300 text-sm font-arial font-semibold mb-3">
                          {subUser?._id}
                        </p>
                        <h6 className="text-gray-700 text-xl font-arial font-semibold mb-3">
                          $ {subUser?.balance?.toFixed(2)} USD
                        </h6>
                      </div>
                      <div className="flex flex-row justify-evenly">
                        <button
                          type="button"
                          class="text-[#f69320] hover:opacity-95 border border-[#f69320] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-6 py-2 text-center mr-2 mb-2 "
                        >
                          Transfer
                        </button>
                        <button
                          type="button"
                          class="text-[#f69320] hover:opacity-95 border border-[#f69320] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-6 py-2 text-center mr-2 mb-2 "
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                    <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row  ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-300 text-sm font-arial font-semibold mb-3">
                          INVESTMENT WALLET
                        </h6>
                        <p className="text-gray-300 text-sm font-arial font-semibold mb-3">
                          #30414477
                        </p>
                        <h6 className="text-gray-700 text-xl font-arial font-semibold mb-3">
                          $ 0.00 USD
                        </h6>
                      </div>
                    </div>
                    {/* <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row  ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-300 text-sm font-arial font-semibold mb-3">
                          PARTNER WALLETS (2)
                        </h6>
                        <p className="text-gray-300 text-sm font-arial font-semibold mb-3">
                          #92769610
                        </p>
                        <h6 className="text-gray-700 text-xl font-arial font-semibold mb-3">
                          0.00 USD
                        </h6>
                      </div>
                      <div className="flex flex-row justify-evenly">
                        <button
                          type="button"
                          class="text-[#f69320] hover:opacity-95 border border-[#f69320] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-6 py-2 text-center mr-2 mb-2 "
                        >
                          Transfer
                        </button>
                        <button
                          type="button"
                          class="text-[#f69320] hover:opacity-95 border border-[#f69320] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-6 py-2 text-center mr-2 mb-2 "
                        >
                          Withdraw
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* <div className="mx-4" ref={catMenu}>
                  <button
                    onClick={() => {
                      setDotMenu(!dotMenu);
                      setIsMenu(false);
                    }}
                    class="flex items-center justify-between w-full py-2 pl-3 pr-4 text-[#f69320] font-montserrat font-medium text-lg border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 "
                  >
                    <Image src={`/squareDots.png`} width={20} height={20} />
                  </button>
                  <div
                    class={`absolute right-10 z-10  ${
                      dotMenu ? " grid " : " hidden "
                    } w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md md:grid-flow-col md:grid-rows-2 px-4`}
                  >
                    <div class="p-4 pb-0 text-gray-900 md:pb-1  md:col-span-12 grid-flow-col border-b border-gray-100 ">
                      <div className="flex flex-row justify-center items-center ">
                        <h6 className="text-gray-500 text-sm font-arial font-semibold mb-3 py-2 text-center">
                          Personal Area
                        </h6>
                      </div>
                    </div>
                    <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row border-b border-gray-100 ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-500 text-sm font-arial font-semibold mb-3 py-2 text-center">
                          Forex International
                        </h6>
                      </div>
                    </div>
                    <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row border-b border-gray-100 ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-500 text-sm font-arial font-semibold mb-3 py-2 text-center">
                          Public Website
                        </h6>
                      </div>
                    </div>
                    <div class="p-4 pb-0 text-gray-900 md:pb-4   md:col-span-12 grid-flow-row border-b border-gray-100 ">
                      <div className="flex flex-col justify-start pr-5">
                        <h6 className="text-gray-500 text-sm font-arial  font-semibold mb-3 py-2 text-center">
                          Patnership
                        </h6>
                      </div>
                    </div>
                  </div>
                </div> */}
              </>
            )}

            {/* {Object.keys(user).length < 1 || Object.keys(admin).length < 1 ? (
             
            ) : null} */}

            {Object?.keys(user).length >= 1 ? (
              <Image
                src={"/DummyImage.png"}
                width={60}
                height={60}
                className="cursor-pointer"
                style={{
                  objectFit: "contain",
                }}
                onClick={() => setaccountSidebarOpen(true)}
              />
            ) : (
              <>
                <p
                  onClick={() => router.replace("/auth/login")}
                  className="text-[#f69320] text-sm mr-5 font-montserrat font-medium cursor-pointer"
                >
                  Login
                </p>
                <p
                  onClick={() => router.replace("/auth/register")}
                  className="text-black text-sm mr-5 font-montserrat font-medium bg-[#f69320] p-1 sm:p-2 rounded-lg cursor-pointer"
                >
                  Register
                </p>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
export default NavBar;

export async function getServerSideProps(context) {
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
  if (userToken == null) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false, // Set it to true if it's a permanent redirect
      },
    };
  } else {
  }

  return {
    props: {},
  };
}
