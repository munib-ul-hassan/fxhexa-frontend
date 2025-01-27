import React from "react";

const Perfmoneydetails = ({ perfect }) => {
  return (
    <div class="relative overflow-x-auto">
      {perfect?.map((payment, index) => (
        <>
          <table
            class="w-9/12 text-sm text-left text-gray-500 border-2 my-2"
            style={{ width: "300px" }}
          >
            <tbody>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Payment Name
                </th>
                <td class="px-6 py-4">{payment?.title}</td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Payment Account
                </th>
                <td class="px-6 py-4">{payment?.Accno}</td>
              </tr>
            </tbody>
          </table>
        </>
      ))}
    </div>
  );
};

export default Perfmoneydetails;
