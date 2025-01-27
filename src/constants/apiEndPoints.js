const _Environments = {
  development: {
    BASE_URL: `https://fxhexa-node-119622bf21f6.herokuapp.com/api/v1/`,
    LOGIN: `auth/login`,
    ADMIN_LOGIN: "admin/login",
    SIGN_UP: `auth/signup`,
    VERIFY_USER: `auth/VerifyUser`,
    GET_PROFILE: `auth/profile`,
    RESEND_CODE: `auth/resend`,
    BUY_SELL_COIN: `transaction/Coin`,
    GET_TRANSACTION: `transaction/getTransactions`,
  },
};

function getEnvironment() {
  const platform = "development";
  return _Environments[platform];
}

const Environment = getEnvironment();
export default Environment;
