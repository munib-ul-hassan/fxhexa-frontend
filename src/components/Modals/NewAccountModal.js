import { handleAccountType } from "@/store/action/accountActions";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import InputField from "../inputs/InputField";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { subAccountSchema } from "../Schema/SubAccountSchema";
import SmallLoader from "../SmallLoader";

const NewAccountModal = ({ modalVisible, onClose, setModalVisible }) => {
  // dispatch
  const dispatch = useDispatch();

  // router
  const router = useRouter();

  // states
  const [accType, setaccType] = useState("");
  const userData = useSelector((state) => state.userReducer.user);
  const [loading, setloading] = useState(false);

  //config
  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  // handle modal close
  const _handleModalClose = () => {
    if (accType == "") {
      Swal.fire({
        title: "Please select your account type to proceed",
        icon: "error",
      });
    } else {
      onClose();
      dispatch(handleAccountType(accType));
    }
  };

  const options = [
    "1:2",
    "1:20",
    "1:50",
    "1:100",
    "1:200",
    "1:400",
    "1:500",
    "1:600",
    "1:800",
    "1:1000",
  ];

  const currency = [
    "USD",
    "PKR",
    "INR",
    "CHY",
    "JPY",
    "AUD",
    "CAD",
    "RIY",
    "AED",
  ];

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-center p-4 inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]`}
    >
      <div className="flex flex-col relative bg-white dark:bg-gray-800 px-5 py-12 w-full md:w-7/12 h-full overflow-y-auto rounded-lg ">
        <div className="flex flex-row justify-end">
          <div
            className=" bg-black text-white px-3 mb-2 rounded cursor-pointer"
            onClick={setModalVisible}
          >
            x
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full ">
          <h1 className="text-center text-gray-500 dark:text-gray-300 text-3xl font-extrabold ">
            Open New Account
          </h1>
        </div>

        <Formik
          initialValues={{
            type: "",
            name: "",
            password: "",
            leverage: "",
            currency: "",
            demoAmount: "",
          }}
          validationSchema={subAccountSchema}
          onSubmit={(values) => {
            console.log("values ==>", values);
            let { demoAmount, ...rest } = values;

            let params = values.type == "demo" ? values : rest;

            setloading(true);
            axios
              .post(`${Environment.BASE_URL}auth/subacc`, params, config)
              .then((res) => {
                console.log("res ==>", res);
                Swal.fire({
                  title: res?.data?.message,
                  icon: "info",
                  showConfirmButton: false,
                  timer: 1800,
                  timerProgressBar: true,
                }).then((Res) => {
                  if (Res.isConfirmed || Res.isDismissed) {
                    setModalVisible(false);
                  }
                });
              })
              .catch((error) => {
                console.log("error ==>", error);
                Swal.fire({
                  title: error.message,
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
            console.log("error ==>", errors);
            return (
              <Form>
                {/* Account Type */}
                <div className=" mt-3">
                  <label
                    for="first_name"
                    class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 dark:text-white"
                  >
                    Account Type
                  </label>
                  <div class="radio-container flex flex-row gap-x-10  ">
                    <div
                      class={`radio-wrapper border px-5 py-2 ${
                        values.type == "demo" && "bg-[#f69320]"
                      }`}
                    >
                      <label class="radio-button ">
                        <Field
                          id="option1"
                          name="type"
                          type="radio"
                          value={"demo"}
                        />
                        <span class="radio-checkmark"></span>
                        <span class="radio-label text-gray-500 dark:text-gray-300  ">
                          Demo Account
                        </span>
                      </label>
                    </div>

                    <div
                      class={`radio-wrapper border px-5 py-2 ${
                        values.type == "real" && "bg-[#f69320]"
                      }`}
                    >
                      <label class="radio-button">
                        <Field
                          id="option2"
                          name="type"
                          type="radio"
                          value={"real"}
                        />
                        <span class="radio-checkmark"></span>
                        <span class="radio-label text-gray-500 dark:text-gray-300">
                          Real Account
                        </span>
                      </label>
                    </div>
                  </div>
                  {errors.type && touched.type && (
                    <p className="text-red-600">{errors.type}</p>
                  )}
                </div>

                {/* Demo Account balance */}
                {values.type == "demo" && (
                  <div className="my-3">
                    <Field
                      component={InputField}
                      name="name"
                      label={"Demo Account balance"}
                      className="w-6/12 "
                      placeholder="Demo Account balance"
                      type="number"
                      value={values.demoAmount}
                      onChange={(e) => {
                        const newVal = e.target.value < 0 ? 0 : e.target.value;
                        setFieldValue("demoAmount", newVal);
                      }}
                      onBlur={() => setFieldTouched("demoAmount")}
                    />
                  </div>
                )}

                {/* Leverage */}
                <div className="my-3">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300"
                  >
                    Max Leverage *
                  </label>
                  <Field
                    as="select"
                    name="leverage"
                    onChange={handleChange("leverage")}
                    id="countries"
                    class="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/12 p-2.5 "
                  >
                    <option value={0}>{`Select leverage`}</option>
                    {options.map((item, i) => {
                      return <option>{item}</option>;
                    })}
                  </Field>
                  {errors.leverage && touched.leverage && (
                    <p className="text-red-600">{errors.leverage}</p>
                  )}
                </div>

                {/* Currency */}
                <div className="my-3">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 "
                  >
                    Currency *
                  </label>
                  <Field
                    as="select"
                    name="currency"
                    handleChange={"currency"}
                    onBlur={() => setFieldTouched("currency")}
                    id="countries"
                    class="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-500 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/12 p-2.5 "
                  >
                    <option>{`Select Currency`}</option>
                    {currency.map((item, i) => {
                      return <option>{item}</option>;
                    })}
                  </Field>
                  {errors.currency && touched.currency && (
                    <p className="text-red-600">{errors.currency}</p>
                  )}
                </div>

                {/* Account Name */}
                <div className="my-3">
                  <Field
                    component={InputField}
                    name="name"
                    label={"Account Nick Name"}
                    className="w-6/12 "
                    placeholder="Account Nick Name "
                    type="text"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={() => setFieldTouched("name")}
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* password */}
                <div className="my-3">
                  <Field
                    component={InputField}
                    label={"Create a password for the account *"}
                    className="w-6/12"
                    placeholder="Create a password for the account *"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={() => setFieldTouched("password")}
                    type="password"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-yellow-400 flex justify-center px-10 py-3 rounded font-bold w-6/12 mt-3"
                >
                  {loading ? <SmallLoader /> : "Create An Account"}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NewAccountModal;
