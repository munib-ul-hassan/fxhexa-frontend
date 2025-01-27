import * as Yup from "yup";

export const TransactionSchema = Yup.object().shape({
  subAccId: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("This Field is Required"),

  unit: Yup.number().min(0.01, "Too Small!").required("This Field is Required"),

  orderType: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("This Field is Required"),

  stopLoss: Yup.number(),

  profitLimit: Yup.number(),
});
