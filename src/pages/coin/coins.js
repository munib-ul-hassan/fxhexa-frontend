import React from "react";
import axios from "axios";

import Main from "@/layout/Main";
import Environment from "@/constants/apiEndPoints";
import { useRouter } from "next/router";

const Coins = ({ coinData }) => {
  // router
  const router = useRouter();
  return (
    <div className="px-8 py-4">
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Coin name
              </th>
              <th scope="col" class="px-6 py-3">
                XXX
              </th>
              <th scope="col" class="px-6 py-3">
                YYY
              </th>
              <th scope="col" class="px-6 py-3">
                ZZZ
              </th>
            </tr>
          </thead>
          <tbody>
            {coinData?.map((item, i) => {
              return (
                <tr
                  key={i}
                  class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.coin}
                  </th>
                  <td class="px-6 py-4">XXX</td>
                  <td class="px-6 py-4">YYY</td>
                  <td class="px-6 py-4">ZZZ</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coins;

Coins.layout = Main;

export async function getServerSideProps(context) {
  let coinData = [];

  try {
    const response = await axios.get(`${Environment.BASE_URL}coins`);
    coinData = response.data?.data;
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      coinData,
    },
  };
}
