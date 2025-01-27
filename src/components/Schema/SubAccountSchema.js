import * as Yup from "yup";

export const subAccountSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("This Field is Required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be 6 character long"),

  leverage: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("This Field is Required"),

  currency: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("This Field is Required"),
});
