import { useRouter } from "next/router";
import React from "react";

const OrdersTable = ({ data }) => {
  // router
  const router = useRouter();

  return (
    <div className="w-full mt-6 mb-12">
      <div className="block w-full ">
        <>
          <div className="mx-2 overflow-x-auto max-h-full">
            <table className="items-center w-full bg-transparent border-collapse ">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    Sr No
                  </th>
                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    Name
                  </th>
                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    Price
                  </th>
                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    Change
                  </th>
                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    24h Volume
                  </th>

                  <th
                    className={
                      "bg-blueGray-200 text-blueGray-900 border-blueGray-100 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                    }
                  >
                    Market Cap
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className={`bg-white border-b-2 hover:bg-slate-100 cursor-pointer`}
                        onClick={() => router.push("/trade/" + item.s)}
                      >
                        <td className="text-black border-t-0  px-4 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3  text-left flex items-center">
                          {`# ${i + 1} `}
                        </td>
                        <td className="text-black border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3">
                          {item.s}
                        </td>
                        <td
                          className={`${
                            Number(item?.P) > 0
                              ? "text-green-500"
                              : "text-red-500"
                          } border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3`}
                        >
                          {Number(item.c).toFixed(2).toLocaleString()}
                        </td>
                        <td
                          className={`${
                            Number(item?.P) > 0
                              ? "text-green-500"
                              : "text-red-500"
                          } border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3`}
                        >
                          {Number(item.P).toFixed(2).toLocaleString()}%
                        </td>
                        <td
                          className={`${
                            Number(item?.P) > 0
                              ? "text-green-500"
                              : "text-red-500"
                          } border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3`}
                        >
                          {Number(item.p).toFixed(2).toLocaleString()}
                        </td>
                        <td
                          className={`text-black border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3`}
                        >
                          {Number(item.q).toFixed(2).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <ul className="block md:hidden ">
            {/* {orders?.length > 0 &&
              orders?.map((ord, i) => {
                // fulfilled check
                const check_fulfilled = () => {
                  if (ord.attributes.fulfilled === false) {
                    return (
                      <span className="text-red-400 text-xs font-bold uppercase">
                        No
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-green-400  text-xs font-bold uppercase">
                        Yes
                      </span>
                    );
                  }
                };
                // delivered Check
                const check_delivered = () => {
                  if (ord.attributes.delivered === false) {
                    return (
                      <span className="text-red-400 text-xs font-bold uppercase">
                        No
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-green-400  text-xs font-bold uppercase">
                        Yes
                      </span>
                    );
                  }
                };
                // cus contact
                const cusContact =
                  ord?.attributes?.customer?.data?.attributes?.user?.data
                    ?.attributes?.contact;

                return (
                  <li
                    key={i}
                    className="w-11/12 bg-gray-200 my-10 mx-3 shadow-lg rounded"
                  >
                    <div className="flex flex-row justify-between bg-gray-300 p-2 ">
                      <p className="font-semibold ">
                        ID: {`#OD-O-${ord?.id} `}
                      </p>
                      <div>
                        <a href={`/admin/order/${ord.id}`}>
                          <i className="text-gray-700 hover:scale-110 text-1xl mx-2 fa-solid fa-eye"></i>
                        </a>
                      </div>
                    </div>
                    <div
                      onClick={() => router.replace(`/admin/order/${ord.id}`)}
                      className="flex flex-row justify-between bg-gray-100 p-2 "
                    >
                      <p className="font-semibold text-sm">Total Amount: </p>
                      <p className="font-bold text-sm ml-2">
                        {ord?.attributes?.totalAmount}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between bg-gray-100 p-2 ">
                      <p className="font-semibold text-sm">
                        Customer Contact:{" "}
                      </p>
                      <p className="font-bold text-sm">
                        {cusContact == null ? "-" : cusContact}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between bg-gray-100 p-2 ">
                      <p className="font-semibold text-sm">Created At: </p>
                      <p className="font-bold text-sm">
                        {ord?.attributes?.publishedAt.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between bg-gray-100 p-2 ">
                      <p className="font-semibold text-sm">Fulfilled: </p>
                      <p className="font-bold text-sm">{check_fulfilled()}</p>
                    </div>
                    <div className="flex flex-row justify-between bg-gray-100 p-2 ">
                      <p className="font-semibold text-sm">Delivered: </p>
                      <p className="font-bold text-sm">{check_delivered()}</p>
                    </div>
                  </li>
                );
              })} */}
          </ul>
        </>
      </div>
    </div>
  );
};

export default OrdersTable;
