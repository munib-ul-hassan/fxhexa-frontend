import * as Yup from "yup";

export const DepositSchema = Yup.object().shape({
  amount: Yup.number().min(1, "Too Small!").required("This Field is Required"),

  transactionID: Yup.string()
    .min(1, "Too Small!")
    .required("This Field is Required"),

  paymentType: Yup.string().min(1).required("This Field is Required"),

  accountref: Yup.string().min(1).required("This Field is Required"),
});

export const WithdrawSchema = Yup.object().shape({
  amount: Yup.number().min(1, "Too Small!").required("This Field is Required"),

  accountref: Yup.string().min(1).required("This Field is Required"),

  paymentType: Yup.string().min(1).required("This Field is Required"),

  paymentCode: Yup.string().min(1).required("This Field is Required"),
});

export const referralSchema = (amount) =>
  Yup.object().shape({
    amount: Yup.number()
      .min(1, "Too Small!")
      .max(amount)
      .required("This field is required"),

    paymentType: Yup.string().min(1).required("This Field is Required"),

    paymentCode: Yup.string().min(1).required("This Field is Required"),
  });
