import ProfileModal from "@/components/Modals/ProfileModal";
import { ProfileSchema } from "@/components/Schema/ProfileSchema";
import SmallLoader from "@/components/SmallLoader";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import InputField from "@/components/inputs/InputField";
import Environment from "@/constants/apiEndPoints";
import Main from "@/layout/Main";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Profile = () => {
  // states
  const userData = useSelector((state) => state.userReducer.user);
  const subUser = useSelector((state) => state?.subUserReducer?.subUser);
  const [userProfile, setUserProfile] = useState([]);
  const [loading, setloading] = useState(false);
  const [profileModal, setprofileModal] = useState(false);

  //config
  const config = {
    headers: {
      Authorization: userData.token,
    },
  };

  // get USER profile
  const _getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${Environment.BASE_URL}/auth/profile`,
        config
      );
      setUserProfile(res?.data?.data);
    } catch (error) {
      Swal.fire({
        title: error?.message || "Something Went Wrong",
        icon: "error",
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    _getUserProfile();
  }, []);

  // handle update profile
  const _handleUpdateProfile = (val) => {
    let params = {
      oldPassword: val.oldPassword,
      newPassword: val.newPassword,
    };
    setloading(true);
    axios
      .post(`${Environment.BASE_URL}auth/changePassword`, params, config)
      .then((res) => {
        Swal.fire({
          title: "Password Changed Successfully",
          icon: "success",
          timer: 3000,
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
  };

  return (
    <div className="min-h-screen flex flex-col p-8 px-10 bg-white dark:bg-gray-800 relative text-gray-300">
      <div className="flex flex-row items-center gap-5 justify-start mt-10">
        <img
          className="w-20 h-20 object-contain"
          src="/profile.png"
          alt="user profile image"
        />
        <div className="flex flex-col">
          <p className="text-[#f69320] text-md font-normal font-montserrat">
            {userProfile?.fullName}
          </p>
          <p className="text-[#f69320] text-md font-normal font-montserrat">
            {userProfile?.email}
          </p>
          <p className="text-[#f69320] text-md font-normal font-montserrat">
            Total SubAccounts: {userProfile?.subAccounts?.length || 0}
          </p>
        </div>

        <div
          onClick={() => {
            setprofileModal(true);
          }}
          className="cursor-pointer flex items-center gap-x-3 p-2 rounded border border-gray-300 shadow shadow-[#f69320] hover:scale-110  duration-150"
        >
          <p className="font-semibold text-md text-[#f69320] dark:text-[#f69320] ">
            Add KYC verification and Update Profile
          </p>
          <img className="w-4 h-4 object-contain  " src={`/pencil.png`} />
        </div>
      </div>
      <ThemeSwitcher />

      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={ProfileSchema}
        onSubmit={(values) => {
          _handleUpdateProfile(values);
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
          // console.log("error ==>", errors);
          return (
            <Form>
              {/* Old password */}
              <div className="my-3 mt-10">
                <Field
                  component={InputField}
                  labelColor={"text-gray-500"}
                  name="oldPassword"
                  label={"Old Password"}
                  className="w-6/12"
                  placeholder="Old Password "
                  type="password"
                  value={values.oldPassword}
                  onChange={handleChange("oldPassword")}
                  onBlur={() => setFieldTouched("oldPassword")}
                />
                {errors.oldPassword && touched.oldPassword && (
                  <p className="text-red-600">{errors.oldPassword}</p>
                )}
              </div>

              {/*  new password */}
              <div className="my-3">
                <Field
                  component={InputField}
                  label={"New Password *"}
                  labelColor={"text-gray-500"}
                  className="w-6/12"
                  placeholder="New Password *"
                  value={values.newPassword}
                  onChange={handleChange("newPassword")}
                  onBlur={() => setFieldTouched("newPassword")}
                  type="password"
                />
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* confirm new password */}
              <div className="my-3">
                <Field
                  component={InputField}
                  label={"Confirm New Password *"}
                  labelColor={"text-gray-500"}
                  className="w-6/12"
                  placeholder="New Password *"
                  value={values.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => setFieldTouched("confirmPassword")}
                  type="password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-yellow-400 flex justify-center mt-10 text-gray-900 px-10 py-3 rounded font-bold w-6/12 "
              >
                {loading ? <SmallLoader /> : "Save Changes"}
              </button>
            </Form>
          );
        }}
      </Formik>

      <ProfileModal
        modalVisible={profileModal}
        onClose={() => {
          setprofileModal(false);
        }}
        config={config}
        data={userProfile}
      />
    </div>
  );
};

export default Profile;

Profile.layout = Main;
