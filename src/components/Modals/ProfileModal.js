import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import InputField from "../inputs/InputField";
import { ProfileSchema2 } from "../Schema/ProfileSchema";
import axios from "axios";
import Environment from "@/constants/apiEndPoints";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import SmallLoader from "../SmallLoader";

function ProfileModal({ modalVisible, onClose, data, config }) {
  // states
  const [loading, setloading] = useState(false);
  const [previewImage, setpreviewImage] = useState([data?.NICF] || []);
  const [image, setimage] = useState([]);
  const [cnicback, setCnicBack] = useState([]);
  const [previewImage2, setpreviewImage2] = useState([data?.NICB] || []);
  const [hoverimage, sethoverimage] = useState(false);
  const [hoverimage2, sethoverimage2] = useState(false);
  const [image3, setimage3] = useState([]);
  const [previewImage3, setpreviewImage3] = useState([data?.POA] || []);

  const router = useRouter();

  useEffect(() => {
    // setpreviewImage([data?.NICF]);
    // setpreviewImage2([data?.NICB]);
    // setpreviewImage3([data?.POA]);
  }, []);

  // get user Modal
  const handleUpdateProfile = (values) => {
    if (image?.length > 0) {
      let formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("file", image[0]);
      formData.append("file", cnicback[0]);
      formData.append("file", image3[0]);

      setloading(true);
      axios
        .put(`${Environment.BASE_URL}auth/profile`, formData, config)
        .then((res) => {
          Swal.fire({
            title: "Profile Updated Successfully",
            icon: "success",
            timer: 3000,
          }).then(() => {
            onClose();
            router.reload();
          });
        })
        .catch((err) => {
          console.log("err ==>", err);
          Swal.fire({
            title: err?.message || "Something Went Wrong",
            icon: "error",
            timer: 3000,
          });
        })
        .finally(() => {
          setloading(false);
        });
    } else {
      setloading(true);
      axios
        .put(`${Environment.BASE_URL}auth/profile`, values, config)
        .then((res) => {
          Swal.fire({
            title: "Profile Updated Successfully",
            icon: "success",
            timer: 3000,
          }).then(() => {
            onClose();
            router.reload();
          });
        })
        .catch((err) => {
          Swal.fire({
            title: err?.message || "Something Went Wrong",
            icon: "error",
            timer: 3000,
          });
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  // handle Image
  const handleImage = (e, setState, previewState) => {
    const fileList = e.target.files;
    setState(fileList);
    const files = [...fileList];

    const previewLinks = files.map((itm) => URL.createObjectURL(itm));
    previewState(previewLinks);
  };

  return (
    <div
      className={`${
        !modalVisible ? "hidden" : "flex flex-col"
      } fixed items-center justify-start p-10 inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col relative bg-white dark:bg-gray-800 px-5 py-12 w-full md:w-5/12 h-54 overflow-y-auto rounded-lg justify-between items-center"
      >
        <div
          onClick={onClose}
          className="absolute top-2 right-2 bg-black rounded text-white px-2 cursor-pointer"
        >
          X
        </div>

        <div className="flex flex-col justify-start items-start  w-full">
          <h2 className=" text-gray-500 dark:text-gray-300 my-2 font-semibold">
            Update User Profile
          </h2>

          <Formik
            enableReinitialize={true}
            initialValues={{
              fullName: data?.fullName || "",
              email: data?.email || "",
              phone: data?.email || "00000-00000",
            }}
            validationSchema={ProfileSchema2}
            onSubmit={(values) => {
              handleUpdateProfile(values);
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
              // console.log("error ==>", errors);
              return (
                <Form className=" w-full ">
                  {/* fullName */}
                  <div className="my-3  ">
                    <Field
                      component={InputField}
                      labelColor={"text-gray-500"}
                      name="fullName"
                      label={"Full Name *"}
                      className="w-8/12"
                      placeholder="Full Name"
                      type="text"
                      value={values.fullName}
                      onChange={handleChange("fullName")}
                      onBlur={() => setFieldTouched("fullName")}
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/*  email */}
                  <div className="my-3">
                    <Field
                      component={InputField}
                      label={"Email *"}
                      labelColor={"text-gray-500"}
                      className="w-8/12"
                      placeholder="Email *"
                      value={values.email}
                      onChange={handleChange("email")}
                      onBlur={() => setFieldTouched("email")}
                      type="email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* phone */}
                  <div className="my-3">
                    <Field
                      component={InputField}
                      label={"Phone "}
                      labelColor={"text-gray-500"}
                      className="w-8/12"
                      placeholder="03002315628"
                      value={values.phone}
                      onChange={(e) => {
                        const newVal = e.target.value < 0 ? 0 : e.target.value;
                        setFieldValue("phone", newVal);
                      }}
                      onBlur={() => setFieldTouched("phone")}
                      type="number"
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* CNIC Image Front */}
                  {previewImage?.length > 0 && (
                    <div className="relative">
                      <img
                        src={previewImage[0]}
                        alt="preview image"
                        className="h-28 w-28 object-cover "
                      />
                      <div
                        onClick={() => {
                          setimage([]);
                          setpreviewImage([]);
                        }}
                        className="absolute top-0 left-0 bg-red-400 rounded-full w-6 h-6 flex justify-center text-white cursor-pointer"
                      >
                        X
                      </div>
                    </div>
                  )}
                  <div className="my-3 relative ">
                    {hoverimage && (
                      <img
                        src={"/cnic.jpg"}
                        className="w-80 h-44 rounded-md absolute -top-40 right-20"
                      />
                    )}
                    <label
                      for="success"
                      className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
                    >
                      CNIC Image (Front)
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type={"file"}
                        id="success"
                        className="bg-gray-100 dark:bg-gray-700 border placeholder:text-gray-400 w-8/12 focus_Login  my-3 border-gray-200 text-gray-500 mb-7   text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-1 "
                        placeholder="Enter Password"
                        onChange={(e) =>
                          handleImage(e, setimage, setpreviewImage)
                        }
                      />
                      <p
                        onMouseEnter={() => sethoverimage(true)}
                        onMouseLeave={() => sethoverimage(false)}
                        className="text-md text-gray-300 cursor-pointer p-2 dark:text-gray-500 underline uppercase font-semibold"
                      >
                        Example
                      </p>
                    </div>
                  </div>

                  {/* CNIC Image Back */}
                  {previewImage2?.length > 0 && (
                    <div className="relative">
                      <img
                        src={previewImage2[0]}
                        alt="preview image"
                        className="h-28 w-28 object-cover "
                      />
                      <div
                        onClick={() => {
                          setCnicBack([]);
                          setpreviewImage2([]);
                        }}
                        className="absolute top-0 left-0 bg-red-400 rounded-full w-6 h-6 flex justify-center text-white cursor-pointer"
                      >
                        X
                      </div>
                    </div>
                  )}
                  <div className="my-3 relative ">
                    {hoverimage2 && (
                      <img
                        src={"/cnicback.jpg"}
                        className="w-80 h-44 rounded-md absolute -top-40 right-20"
                      />
                    )}
                    <label
                      for="success"
                      className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
                    >
                      CNIC Image (Back)
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type={"file"}
                        id="success"
                        className="bg-gray-100 dark:bg-gray-700 border placeholder:text-gray-400 w-8/12 focus_Login  my-3 border-gray-200 text-gray-500 mb-7   text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-1 "
                        placeholder="Enter Password"
                        onChange={(e) =>
                          handleImage(e, setCnicBack, setpreviewImage2)
                        }
                      />
                      <p
                        onMouseEnter={() => sethoverimage2(true)}
                        onMouseLeave={() => sethoverimage2(false)}
                        className="text-md text-gray-300 cursor-pointer p-2 dark:text-gray-500 underline uppercase font-semibold"
                      >
                        Example Back
                      </p>
                    </div>
                  </div>

                  {/* Proof of Address */}
                  {previewImage3?.length > 0 && (
                    <div className="relative">
                      <img
                        src={previewImage3[0]}
                        alt="preview image"
                        className="h-28 w-28 object-cover "
                      />
                      <div
                        onClick={() => {
                          setimage3([]);
                          setpreviewImage3([]);
                        }}
                        className="absolute top-0 left-0 bg-red-400 rounded-full w-6 h-6 flex justify-center text-white cursor-pointer"
                      >
                        X
                      </div>
                    </div>
                  )}
                  <div className="my-3 relative ">
                    <label
                      for="success"
                      className="block mb-2 text-sm font-medium font-montserrat text-gray-500 dark:text-gray-300 "
                    >
                      Proof of Address
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type={"file"}
                        id="success"
                        className="bg-gray-100 dark:bg-gray-700 border placeholder:text-gray-400 w-8/12 focus_Login  my-3 border-gray-200 text-gray-500 mb-7   text-sm rounded-lg focus:ring-[#f69320] focus:outline-none focus:border-[#f69320] block  p-1 "
                        placeholder="Enter Password"
                        onChange={(e) =>
                          handleImage(e, setimage3, setpreviewImage3)
                        }
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-yellow-400 flex justify-center mt-10 text-gray-900 px-10 py-3 rounded font-bold w-12/12 "
                  >
                    {loading ? <SmallLoader /> : "Update Profile"}
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
