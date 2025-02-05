import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import InputField from "@/components/inputs/InputField";
import SmallLoader from "@/components/SmallLoader";
import * as Yup from "yup";
import { useRouter } from "next/router";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { handleUser } from "@/store/action/cartAction";

const ForgetPassword = () => {
  // states
  const [loading, setloading] = useState(false);
  const [verifiedEmail, setverifiedEmail] = useState(false);
  const [sendToken, setSendToken] = useState("");
  const [authToken, setauthToken] = useState("");

  const config = {
    headers: {
      Authorization: authToken,
    },
  };

  const dispatch = useDispatch();

  const router = useRouter();

  // email schema
  const forgetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("This email address is not valid")
      .required("Please enter your email address!")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "This email address is not valid"
      ),
  });

  // email token schema
  const tokenSchema = Yup.object().shape({
    sendToken: Yup.string().required("Required"),
    emailToken: Yup.string()
      .oneOf([Yup.ref("sendToken"), null], "OTP does not match!")
      .required("Required"),
  });

  // handle send OTP
  const _handleSendOTP = (values) => {
    setloading(true);
    axios
      .post(`${Environment.BASE_URL}auth/forgetpassword`, values)
      .then((res) => {
        if (res?.data?.status == true) {
          setSendToken(res?.data?.data?.OTP);
          setauthToken(res?.data?.data?.token);
          Swal.fire({
            title: "OTP Send Successfully to your Email",
            text: "Please Check Your Inbox",
            timer: 3000,
            icon: "success",
          }).then((SwalRes) => {
            setverifiedEmail(true);
          });
        } else {
          Swal.fire({
            title: res?.data?.message || "Some Thing Went Wrong",
            timer: 3000,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: res?.data?.message || "Some Thing Went Wrong",
          timer: 3000,
          icon: "error",
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  // handle verify OTP
  const _handleVerifyOTP = (values) => {
    let params = {
      otp: values.sendToken,
      deviceToken: "abc",
      deviceType: "postman",
    };
    setloading(true);
    axios
      .post(`${Environment.BASE_URL}auth/verifyotp`, params, config)
      .then((res) => {
        if (res?.data?.status == true) {
          dispatch(handleUser(res.data.data));
          Swal.fire({
            title: "OTP Verified Successfully",
            timer: 3000,
            icon: "success",
          }).then((SwalRes) => {
            router.replace("/auth/newPassword");
          });
        } else {
          Swal.fire({
            title: res?.data?.message || "Some Thing Went Wrong",
            timer: 3000,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: err?.data?.message || "Some Thing Went Wrong",
          timer: 3000,
          icon: "error",
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  return (
    <div className=" w-full h-full flex-col items-center bg-white dark:bg-gray-800 ">
      <div className="bg-[#f69320] flex space-x-2 items-center justify-center py-3 w-full ">
        <Image src={"/lock.png"} alt="Lock Image" width={20} height={20} />
        <p className="text-slate-800 text-xs font-medium font-montserrat">
          URL verification: https://accounts.vinzex.com
        </p>
      </div>

      <div className="flex flex-1 min-h-screen flex-col justify-center items-center">
        {verifiedEmail == false ? (
          <>
            <p className="text-gray-500 dark:text-gray-300 text-3xl font-semibold font-montserrat mb-10 uppercase">
              Enter Email Address To receive OTP
            </p>
            <Formik
              enableReinitialize={true}
              initialValues={{
                email: "",
              }}
              validationSchema={forgetPasswordSchema}
              onSubmit={(values) => {
                _handleSendOTP(values);
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
                isValid,
                values,
              }) => {
                return (
                  <Form className=" w-full flex flex-col items-center justify-center   ">
                    {/* email */}
                    <div className="my-3 w-4/12 ">
                      <Field
                        component={InputField}
                        labelColor={"text-gray-500"}
                        name="email"
                        label={"Email *"}
                        className="w-12/12"
                        placeholder="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={() => setFieldTouched("email")}
                      />
                      {errors.email && touched.email && (
                        <p className="text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      disabled={!isValid}
                      type="submit"
                      onClick={handleSubmit}
                      className="bg-yellow-400 flex justify-center mt-10 text-gray-900 px-10 py-3 rounded font-bold w-4/12 "
                    >
                      {loading ? <SmallLoader /> : "Send OTP"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-300 text-3xl font-semibold font-montserrat mb-10 uppercase">
              Verify Your OTP
            </p>

            <Formik
              enableReinitialize={true}
              initialValues={{
                sendToken: "",
                emailToken: sendToken,
              }}
              validationSchema={tokenSchema}
              onSubmit={(values) => {
                _handleVerifyOTP(values);
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
                isValid,
                values,
              }) => {
                return (
                  <Form className=" w-full flex flex-col items-center justify-center   ">
                    {/* sendToken */}
                    <div className="my-3 w-4/12 ">
                      <Field
                        component={InputField}
                        labelColor={"text-gray-500"}
                        name="sendToken"
                        label={"Enter OTP *"}
                        className="w-12/12"
                        placeholder="Enter OTP from Email"
                        type="text"
                        value={values.sendToken}
                        onChange={handleChange("sendToken")}
                        onBlur={() => setFieldTouched("sendToken")}
                      />
                      {errors.emailToken && touched.sendToken && (
                        <p className="text-red-600">{errors.emailToken}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      disabled={!isValid}
                      type="submit"
                      onClick={handleSubmit}
                      className="bg-yellow-400 flex justify-center mt-10 text-gray-900 px-10 py-3 rounded font-bold w-4/12 "
                    >
                      {loading ? <SmallLoader /> : "Verify OTP"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
