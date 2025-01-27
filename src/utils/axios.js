import axios from "axios";
import Environment from "@/constants/apiEndPoints";

// setup base thing
const apiRequest = axios.create({
  baseURL: Environment.BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

apiRequest.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
  },
  (error) => {
    // todo for login
    // if (error.response.status === 403 || error.response.status === 401) {
    //   // alert(error.response.data.message);
    //   _logout();
    // }
    return Promise.reject(error.response);
  }
);

export default apiRequest;
