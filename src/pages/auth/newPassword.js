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
import { useSelector } from "react-redux";

const NewPassword = () => {
  // states
  const [loading, setloading] = useState(false);

  const userData = useSelector((state) => state.userReducer.user);

  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  const router = useRouter();

  // New Password schema
  const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be 8 character long"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password does not match!")
      .required("Confirm Password is Required")
      .min(8, "Password must be 8 character long"),
  });

  // handle reset password
  const _handleResetPassword = (values) => {
    let params = {
      password: values.password,
    };
    setloading(true);
    axios
      .post(`${Environment.BASE_URL}auth/resetpassword`, params, config)
      .then((res) => {
        if (res?.data?.status == true) {
          Swal.fire({
            title: "Password Resetted Successfully",
            timer: 3000,
            icon: "success",
          }).then((SwalRes) => {
            router.replace("/auth/login");
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
          URL verification: https://accounts.fxhexa.com
        </p>
      </div>

      <div className="flex flex-1 min-h-screen flex-col justify-center items-center">
        <p className="text-gray-500 dark:text-gray-300 text-3xl font-semibold font-montserrat mb-10 uppercase">
          Set New Password
        </p>
        <Formik
          enableReinitialize={true}
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={newPasswordSchema}
          onSubmit={(values) => {
            _handleResetPassword(values);
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
                {/* password */}
                <div className="my-3 w-4/12 ">
                  <Field
                    component={InputField}
                    labelColor={"text-gray-500"}
                    name="password"
                    label={"Enter Password *"}
                    className="w-12/12"
                    placeholder="Enter Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={() => setFieldTouched("password")}
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* confirmPassword */}
                <div className="my-3 w-4/12 ">
                  <Field
                    component={InputField}
                    labelColor={"text-gray-500"}
                    name="confirmPassword"
                    label={"Confirm Password *"}
                    className="w-12/12"
                    placeholder="Confirm Password"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    onBlur={() => setFieldTouched("confirmPassword")}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
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
      </div>
    </div>
  );
};

export default NewPassword;
