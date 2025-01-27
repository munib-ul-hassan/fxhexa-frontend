import {
  DepositSchema,
  WithdrawSchema,
} from "@/components/Schema/DepositSchema";
import SmallLoader from "@/components/SmallLoader";
import Bankdetails from "@/components/bankdetails";
import Perfmoneydetails from "@/components/perfmoneydetails";
import BitcoinDetails from "@/components/bitcoinDetails";
import Environment from "@/constants/apiEndPoints";
import Main from "@/layout/Main";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import UsdtDetail from "@/components/UsdtDetail";

const Withdraw = () => {
  // state
  const [loading, setloading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const state = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state.subUserReducer.subUser);
  const [transactionType, settransactionType] = useState("deposit");
  const [realAccounts, setrealAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bank, setBank] = useState([]);
  const [perfect, setPerfect] = useState([]);
  const [bitcoin, setBitcoin] = useState([]);
  const [usdt, setUsdt] = useState([]);

  const bankItems = bank.map((item) => {
    return {
      title: item?.title,
      Accno: item?.Accno,
      iban: item?.iban,
    };
  });

  console.log(bankItems, "bankItems");

  const payment_options = [
    {
      value: "perfect",
      label: "Perfect Money",
    },
    {
      value: "bank",
      label: "Pakistan Local Bank Transfer",
    },
    {
      value: "bitcoin",
      label: "Bitcoin",
    },

    {
      value: "USDT",
      label: "USDT",
    },
  ];
  console.log(payments, "paymentsData");
  // router
  const router = useRouter();

  //config
  const config = {
    headers: {
      Authorization: state?.user?.token,
      "Content-Type": "multipart/form-data",
    },
  };
  const config1 = {
    headers: {
      Authorization: state?.user?.token,
      "Content-Type": "multipart/form-data",
    },
  };

  // get subaccounts
  const getSubAccounts = () => {
    axios
      .get(`${Environment.BASE_URL}auth/subacc`, config1)
      .then((res) => {
        const real = res?.data?.data?.filter((x) => x?.type == "real");

        setrealAccounts(real?.reverse());
      })
      .catch((error) => {
        console.log("e ==>", error);
      });
  };

  //get payments

  const getPayments = () => {
    axios
      .get(`${Environment.BASE_URL}payment`, config1)
      .then((res) => {
        console.log(res, "payments");
        const paymentsData = res?.data?.data || [];

        // Set data based on paymentType
        const bankPayments = paymentsData.filter(
          (payment) => payment.paymentType === "bank"
        );
        const perfectPayments = paymentsData.filter(
          (payment) => payment.paymentType === "perfect"
        );

        const bitcoinPayments = paymentsData.filter(
          (payment) => payment.paymentType === "bitcoin"
        );

        const usdtPayments = paymentsData.filter(
          (payment) => payment.paymentType === "usdt"
        );

        setBank(bankPayments);
        setPerfect(perfectPayments);
        setBitcoin(bitcoinPayments);
        setUsdt(usdtPayments);
      })
      .catch((error) => {
        console.log("Error fetching payments:", error);
      });
  };

  // handle Image
  const handleImage = (e) => {
    const fileList = e.target.files;
    setImage(fileList);
    const files = [...fileList];

    const previewLinks = files.map((itm) => URL.createObjectURL(itm));
    setPreviewImage(previewLinks);
  };

  useEffect(() => {
    getSubAccounts();
    getPayments();
  }, []);

  return (
    <div className="min-h-screen p-5 bg-white dark:bg-gray-800">
      <h6 className="text-2xl font-bold my-6 text-gray-500 dark:text-gray-300">
        Create Deposit Request
      </h6>
      {/* <p className="text-white">Random ID: {randomID}</p> */}

      <div className="grid grid-cols-12">
        {/* column 1 */}
        <div className="col-span-6">
          <Formik
            initialValues={{
              amount: "",
              accountref: "",
              transactionID: "",
              paymentType: "",
            }}
            validationSchema={DepositSchema}
            onSubmit={(values) => {
              console.log("val", values);
              setloading(true);
              let formData = new FormData();
              formData.append("amount", values.amount);
              formData.append("accountref", values.accountref);
              formData.append("transactionID", values.transactionID);
              formData.append("paymentType", values.paymentType);
              formData.append("file", image[0]);
              formData.append("requestType", "deposit");

              axios
                .post(`${Environment.BASE_URL}user/request`, formData, config)
                .then((res) => {
                  console.log("res ==>", res);
                  Swal.fire({
                    title: res?.data?.message,
                    icon: "info",
                    timer: 1800,
                    timerProgressBar: true,
                    showConfirmButton: false,
                  }).then((swalRes) => {
                    router.replace("/withdraw/withdraw");
                  });
                })
                .catch((error) => {
                  console.log("DepositSchema error ==>", error);
                  Swal.fire({
                    title:
                      error?.response?.data?.message || "Something went wrong",
                    icon: "error",
                  });
                })
                .finally(() => {
                  setloading(false);
                });
            }}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldTouched,
              handleSubmit,
              values,
              setFieldValue,
            }) => {
              return (
                <Form className="flex flex-col space-y-8">
                  {/* payment method */}
                  <div className="">
                    <label
                      for="countries"
                      className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 uppercase  "
                    >
                      payment method
                    </label>
                    <Field
                      as="select"
                      name="paymentType"
                      id="countries"
                      onChange={(e) => {
                        setFieldValue("paymentType", e.target.value);
                        setPaymentMethod(e.target.value);
                      }}
                      className="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg block w-full p-2.5"
                    >
                      <option selected disabled value={0}>
                        Choose an option
                      </option>
                      {payment_options.map((item, i) => {
                        return (
                          <option value={item.value} key={i}>
                            {item.label}
                          </option>
                        );
                      })}
                    </Field>
                    {errors.paymentType && touched.paymentType && (
                      <p className="text-red-600">{errors.paymentType}</p>
                    )}
                  </div>

                  {/* amount */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 dark:text-white">
                      Amount ( $ USD ){" "}
                    </label>
                    <Field
                      type="text"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange("amount")}
                      placeholder="0.00 USD"
                      className="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {errors.amount && touched.amount && (
                      <p className="text-red-600">{errors.amount}</p>
                    )}
                  </div>

                  {/* transaction ID */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 ">
                      Transaction ID
                    </label>
                    <Field
                      disabled={true}
                      name="transactionID"
                      type="text"
                      value={values.transactionID}
                      onChange={handleChange("transactionID")}
                      placeholder="Transaction ID"
                      className="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    <p
                      className="px-2 text-black cursor-pointer bg-[#f69320] mt-1 w-fit rounded-md"
                      onClick={() => {
                        const characters =
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        let newID = "";
                        const idLength = 16;

                        for (let i = 0; i < idLength; i++) {
                          const randomIndex = Math.floor(
                            Math.random() * characters.length
                          );
                          newID += characters.charAt(randomIndex);
                        }

                        setFieldValue("transactionID", newID);
                      }}
                    >
                      Generate Random ID
                    </p>
                    {errors.transactionID && touched.transactionID && (
                      <p className="text-red-600">{errors.transactionID}</p>
                    )}
                  </div>

                  {/* User Account */}
                  <div className="">
                    <label
                      for="countries"
                      class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 "
                    >
                      Select Trading Account
                    </label>
                    <Field
                      as="select"
                      name="accountref"
                      onChange={(e) =>
                        setFieldValue("accountref", e.target.value)
                      }
                      id="countries"
                      class="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg block w-full p-2.5 "
                    >
                      <option selected disabled value={0}>
                        Choose an Trading Account
                      </option>
                      {realAccounts?.map((item, i) => {
                        return <option value={item?._id}>{item?.name}</option>;
                      })}
                    </Field>
                    {errors.accountref && touched.accountref && (
                      <p className="text-red-600">{errors.accountref}</p>
                    )}
                  </div>

                  {/* Image */}
                  <div className="flex flex-col mb-3 w-5/12">
                    {previewImage?.length > 0 && (
                      <div className="relative">
                        <img
                          src={previewImage[0]}
                          alt="preview image"
                          className="h-44 w-44 object-cover "
                        />
                        <div
                          onClick={() => {
                            setImage([]);
                            setPreviewImage([]);
                          }}
                          className="absolute top-0 left-0 bg-red-400 rounded-full w-6 h-6 flex justify-center text-white cursor-pointer"
                        >
                          X
                        </div>
                      </div>
                    )}
                    <label
                      class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300  uppercase text-md"
                      htmlFor="large_size"
                    >
                      Upload Image
                    </label>
                    <input
                      onChange={(e) => handleImage(e)}
                      class="block w-full text-lg py-1 text-gray-500 dark:text-gray-300 border border-gray-300 rounded-lg cursor-pointer dark:bg-gray-700 bg-gray-100  focus:outline-none"
                      id="large_size"
                      type="file"
                    />
                    {image.length == 0 ? (
                      <div className="text-red-600">{`Image is Required`}</div>
                    ) : null}
                  </div>

                  {/* Submit */}
                  <div
                    onClick={handleSubmit}
                    className="text-white mt-10 flex flex-row justify-center cursor-pointer bg-[#1e69ae]  hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#1e69ae] font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
                    type="submit"
                  >
                    {loading ? <SmallLoader /> : "Submit"}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
        {/* column 2 */}
        {transactionType == "deposit" && (
          <div className="col-span-6 flex flex-col items-center p-4">
            {paymentMethod == "bank" ? (
              <Bankdetails bank={bank} />
            ) : paymentMethod == "bitcoin" ? (
              <BitcoinDetails bitcoin={bitcoin} />
            ) : paymentMethod == "perfect" ? (
              <Perfmoneydetails perfect={perfect} />
            ) : paymentMethod == "USDT" ? (
              <UsdtDetail usdt={usdt} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdraw;

Withdraw.layout = Main;
