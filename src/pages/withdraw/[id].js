import { WithdrawSchema } from "@/components/Schema/DepositSchema";
import SmallLoader from "@/components/SmallLoader";
import Environment from "@/constants/apiEndPoints";
import Main from "@/layout/Main";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useSubAccounts } from "../deposits/[id]";

const Withdraw = () => {
  // state
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const state = useSelector((state) => state.userReducer);
  const subUser = useSelector((state) => state.subUserReducer.subUser);
  const [realAccounts, setrealAccounts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

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
    },
  };

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

  // handle Image
  const handleImage = (e) => {
    const fileList = e.target.files;
    setImage(fileList);
    const files = [...fileList];

    const previewLinks = files.map((itm) => URL.createObjectURL(itm));
    setPreviewImage(previewLinks);
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

  useEffect(() => {
    getSubAccounts();
  }, []);

  return (
    <div className="min-h-screen p-5 bg-white dark:bg-gray-800 ">
      <h6 className="text-2xl font-bold my-6 text-gray-500 dark:text-gray-300">
        Create Withdraw Request
      </h6>
      <div className="w-6/12">
        {/* Withdraw */}
        <Formik
          initialValues={{
            amount: "",
            accountref: "",
            // transactionID: "testtest",
            accountName: "",
            paymentType: "",
            requestType: "withdraw",
            paymentCode: "",
          }}
          validationSchema={WithdrawSchema}
          onSubmit={(values) => {
            let allValues = JSON.stringify(values);
            allValues = JSON.parse(allValues);
            allValues.paymentCode =
              values.accountName + " " + values.paymentCode;
            delete allValues.accountName;
            console.log(allValues, values);

            axios
              .post(`${Environment.BASE_URL}user/request`, allValues, config)
              .then((res) => {
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
                console.log("error ==>", error);
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
            setFieldValue,
            values,
          }) => {
            return (
              <Form className="flex flex-col space-y-5">
                {/* payment method */}
                <div className="">
                  <label
                    for="countries"
                    className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300   "
                  >
                    Payment method
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
                    {payment_options.map((item, i) => {
                      return (
                        <option
                          selected={i == 0 ? true : false}
                          value={item.value}
                          key={i}
                        >
                          {item.label}
                        </option>
                      );
                    })}
                  </Field>
                  {errors.paymentType && touched.paymentType && (
                    <p className="text-red-600">{errors.paymentType}</p>
                  )}
                </div>

                {/* Payment Code */}
                {paymentMethod == "bank" && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 ">
                      Enter Your Account Title
                    </label>
                    <Field
                      name="accountName"
                      type="text"
                      value={values.accountName}
                      onChange={handleChange("accountName")}
                      placeholder={"Enter Your Account Title"}
                      className="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {errors.accountName && touched.accountName && (
                      <p className="text-red-600">{errors.accountName}</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 ">
                    {paymentMethod == "bank"
                      ? "Enter Account IBAN number"
                      : paymentMethod == "bitcoin"
                      ? "Bitcoin ID"
                      : paymentMethod == "perfect"
                      ? "perfect Money ID"
                      : paymentMethod == "USDT"
                      ? "USDT ID"
                      : null}
                  </label>
                  <Field
                    name="paymentCode"
                    type="text"
                    value={values.paymentCode}
                    onChange={handleChange("paymentCode")}
                    placeholder={
                      paymentMethod == "bank"
                        ? "Enter Account IBAN number"
                        : paymentMethod == "bitcoin"
                        ? "Bitcoin ID"
                        : paymentMethod == "perfect"
                        ? "perfect Money ID"
                        : paymentMethod == "USDT"
                        ? "USDT ID"
                        : null
                    }
                    className="dark:bg-gray-700 bg-gray-100 border border-gray-300 outline-none text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  {errors.paymentCode && touched.paymentCode && (
                    <p className="text-red-600">{errors.paymentCode}</p>
                  )}
                </div>

                {/* amount */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-500  dark:text-white">
                    Amount ( $ USD )
                  </label>
                  <Field
                    type="text"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange("amount")}
                    placeholder="0.00 USD"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 placeholder:text-gray-400 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  {errors.amount && touched.amount && (
                    <p className="text-red-600">{errors.amount}</p>
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
                    <option selected={true}>Select Trading Account</option>
                    {realAccounts?.map((item, i) => {
                      return <option value={item?._id}>{item?.name}</option>;
                    })}
                  </Field>
                  {errors.accountref && touched.accountref && (
                    <p className="text-red-600">{errors.accountref}</p>
                  )}
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
      </div>
    </div>
  );
};

export default Withdraw;

Withdraw.layout = Main;
