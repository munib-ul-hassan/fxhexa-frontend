import React from "react";

const Bankdetails = ({ bank }) => {
  console.log(bank, "bank");
  return (
    <div className="relative overflow-x-auto">
      {bank?.map((payment, index) => (
        <React.Fragment key={index}>
          <table
            className="w-9/12 text-sm text-left text-gray-500 border-2 my-2"
            style={{ width: "300px" }}
          >
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Bank Name
                </th>
                <td className="px-6 py-4">{payment.title}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Account Title
                </th>
                <td className="px-6 py-4">{payment.Accno}</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Account Number
                </th>
                <td className="px-6 py-4">{payment.iban}</td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Bankdetails;
