import * as Yup from "yup";

export const ProfileSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(2, "Too Short!")
    .max(11, "Too Long!")
    .required("This Field is Required"),

  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be 8 character long"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Password does not match!")
    .required("Confirm Password is Required")
    .min(8, "Password must be 8 character long"),
});

export const ProfileSchema2 = Yup.object().shape({
  fullName: Yup.string().min(3, "Too Short").required(),

  email: Yup.string().email("Invalid email address").required(),

  phone: Yup.string()
    .matches(/^\d+$/, "Phone number must only contain digits")
    .min(8, "Phone number must be at least 8 digits")
    .max(12, "Phone number must be at most 12 digits"),
});
