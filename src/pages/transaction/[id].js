import React, { useState } from "react";
import Main from "@/layout/Main";
import Bankdetails from "@/components/bankdetails";
import Perfmoneydetails from "@/components/perfmoneydetails";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { Field, Form, Formik } from "formik";
import {
  DepositSchema,
  WithdrawSchema,
} from "@/components/Schema/DepositSchema";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import SmallLoader from "@/components/SmallLoader";

const Deposits = () => {
  const payment_options = [
    // {
    //   value: "perfect",
    //   label: "Perfect Money",
    // },
    {
      value: "bank",
      label: "Pakistan Local Bank Transfer",
    },
    {
      value: "bitcoin",
      label: "Bitcoin",
    },

    // {
    //   value: "USDT",
    //   label: "USDT",
    // },
  ];

  // router
  const router = useRouter();

  // states
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const state = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state.subUserReducer.subUser);
  const [loading, setloading] = useState(false);
  const [transactionType, settransactionType] = useState("deposit");

  // handle Image
  const handleImage = (e) => {
    const fileList = e.target.files;
    setImage(fileList);
    const files = [...fileList];

    const previewLinks = files.map((itm) => URL.createObjectURL(itm));
    setPreviewImage(previewLinks);
  };

  //config
  const config = {
    headers: {
      Authorization: state?.user?.token,
      "Content-Type": "multipart/form-data",
    },
  };

  return (
    <div className="min-h-screen p-5">
      <div className="flex flex-row justify-between items-center w-full ">
        <h6 className="text-2xl font-bold my-6">
          {transactionType == "deposit" ? "Deposit" : "Withdraw"}
        </h6>

        <div class=" flex justify-between gap-x-5 ">
          <div
            onClick={() => settransactionType("deposit")}
            className={`  px-5 py-2 cursor-pointer bg-[#f69320] ${
              transactionType == "deposit" ? "opacity-100" : "opacity-80"
            } flex justify-center items-center gap-x-2 rounded-md`}
          >
            <img
              src={
                transactionType == "deposit"
                  ? "/checkbox.png"
                  : "/unchecked.png"
              }
              className="w-5 h-5"
            />
            <p className="text-white font-semibold text-lg uppercase">
              deposit
            </p>
          </div>
          <div
            onClick={() => settransactionType("Withdraw")}
            className={`  px-5 py-2 cursor-pointer bg-[#f69320] ${
              transactionType == "Withdraw" ? "opacity-100" : "opacity-80"
            } flex justify-center items-center gap-x-2 rounded-md`}
          >
            <img
              src={
                transactionType == "Withdraw"
                  ? "/checkbox.png"
                  : "/unchecked.png"
              }
              className="w-5 h-5"
            />
            <p className="text-white font-semibold text-lg uppercase">
              Withdraw
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12">
        {/* column 1 */}
        <div className=" col-span-6">
          {transactionType == "deposit" ? (
            // Deposit
            <Formik
              initialValues={{
                amount: "",
                accountref: subUser?._id,
                transactionID: "",
                paymentType: "",
              }}
              validationSchema={DepositSchema}
              onSubmit={(values) => {
                setloading(true);
                let formData = new FormData();
                formData.append("amount", values.amount);
                formData.append("accountref", subUser?._id);
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
                    });
                  })
                  .catch((error) => {
                    console.log("error ==>", error);
                    Swal.fire({
                      title:
                        error?.response?.data?.message ||
                        "Something went wrong",
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
                        className="block mb-2 text-sm font-medium text-gray-900 uppercase  "
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
                        className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      >
                        <option selected value={0}>
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
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Amount ( $ USD ){" "}
                      </label>
                      <Field
                        type="text"
                        name="amount"
                        value={values.amount}
                        onChange={handleChange("amount")}
                        placeholder="0.00 USD"
                        className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      {errors.amount && touched.amount && (
                        <p className="text-red-600">{errors.amount}</p>
                      )}
                    </div>

                    {/* transaction ID */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Transaction ID
                      </label>
                      <Field
                        name="transactionID"
                        type="text"
                        value={values.transactionID}
                        onChange={handleChange("transactionID")}
                        placeholder="0.00 USD"
                        className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      {errors.transactionID && touched.transactionID && (
                        <p className="text-red-600">{errors.transactionID}</p>
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
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white uppercase text-md"
                        htmlFor="large_size"
                      >
                        Upload Image
                      </label>
                      <input
                        onChange={(e) => handleImage(e)}
                        class="block w-full text-lg py-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
                        id="large_size"
                        type="file"
                      />
                      {image.length == 0 ? (
                        <div className="text-red-400">{`Image is Required`}</div>
                      ) : null}
                    </div>

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
          ) : (
            // Withdraw
            <Formik
              initialValues={{
                amount: "",
                accountref: subUser?._id,
              }}
              validationSchema={WithdrawSchema}
              onSubmit={(values) => {
                setloading(true);
                let formData = new FormData();
                formData.append("amount", values.amount);
                formData.append("accountref", subUser?._id);

                formData.append("file", image[0]);
                formData.append("requestType", "withdraw");

                axios
                  .post(`${Environment.BASE_URL}user/request`, formData, config)
                  .then((res) => {
                    console.log("res ==>", res);
                    Swal.fire({
                      title: res?.data?.message,
                      icon: "info",
                    });
                  })
                  .catch((error) => {
                    console.log("error ==>", error);
                    Swal.fire({
                      title:
                        error?.response?.data?.message ||
                        "Something went wrong",
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
              }) => {
                // console.log("val ====>", errors);
                return (
                  <Form className="flex flex-col space-y-8">
                    {/* amount */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Amount ( $ USD ){" "}
                      </label>
                      <Field
                        type="text"
                        name="amount"
                        value={values.amount}
                        onChange={handleChange("amount")}
                        placeholder="0.00 USD"
                        className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      {errors.amount && touched.amount && (
                        <p className="text-red-600">{errors.amount}</p>
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
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white uppercase text-md"
                        htmlFor="large_size"
                      >
                        Upload Image
                      </label>
                      <input
                        onChange={(e) => handleImage(e)}
                        class="block w-full text-lg py-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
                        id="large_size"
                        type="file"
                      />
                      {image.length == 0 ? (
                        <div className="text-red-400">{`Image is Required`}</div>
                      ) : null}
                    </div>

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
          )}
        </div>
        {/* column 2 */}
        {transactionType == "deposit" && (
          <div className="col-span-6 flex flex-col items-center p-4">
            {paymentMethod == "bank" ? (
              <Bankdetails />
            ) : paymentMethod == "bitcoin" ? (
              <div className="flex flex-col items-center justify-center ">
                <h6 className="text-xl font-bold mb-3">BTC Wallet Address </h6>
                <img alt="QR Code" src={`/qrcode.png`} className="w-80 h-72 " />
                <h6 className="text-md font-bold mb-3 mt-4">
                  bc1qgrexs70wcvzduafmh7qcw4nhc4qx8zk5ywa4r9{" "}
                </h6>
              </div>
            ) : paymentMethod == "perfect" ? (
              <Perfmoneydetails />
            ) : paymentMethod == "USDT" ? (
              <div className="flex flex-col items-center justify-center ">
                <h6 className="text-xl font-bold mb-3">USDT Address </h6>
                <img alt="QR Code" src={`/USDT.jfif`} className="w-80 h-72 " />
                <h6 className="text-md font-bold mb-3 mt-4">
                  TPQ5HWo1JTkXvTUUhbbf6fR4SYRZFk1R1L{" "}
                </h6>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposits;

Deposits.layout = Main;

export async function getServerSideProps(context) {
  const userToken = context?.req?.cookies.userToken;

  if (userToken == null) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false, // Set it to true if it's a permanent redirect
      },
    };
  }

  return {
    props: {},
  };
}
