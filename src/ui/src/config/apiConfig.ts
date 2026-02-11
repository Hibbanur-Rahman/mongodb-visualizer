
import toast from "react-hot-toast";
import axios from "axios";
const Request = async (httpOptions:{
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
  headers?: Record<string, string>;
  secure?: boolean;
  files?: boolean;
  exact?: boolean;
}) => {

  const token = localStorage.getItem("access_token");
  if (!httpOptions.exact) {
    const basename = localStorage.getItem('basename') || '';
    console.log("basename from localStorage:", basename);
    httpOptions.url = basename+"/" + import.meta.env.VITE_API_URL+"/" + httpOptions.url;
    console.log("http header:",httpOptions);
  }
  httpOptions.headers = {
    "Content-Type": httpOptions.files
      ? "multipart/form-data"
      : "application/json",
    Accept: "application/json",
    ...httpOptions.headers,
  };
  if (httpOptions.secure) {
    httpOptions.headers.Authorization = `Bearer ${token}`;
  }

  const handleRequestErrors = (error:unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      console.log("error response", data);
      if (status === 401 && data?.message === "Unauthorized: Invalid token") {
        window.location.replace("/login");
      } else if (status == 413) {
        toast.error("File size exceeds the limit");
      }
    } else if (axios.isAxiosError(error) && error.request) {
      console.log("error request", error.request);
    } else if (axios.isAxiosError(error)) {
      console.log("error message", error.message);
    }
  };

  return axios(httpOptions)
    .then((response) => response)
    .catch((error) => {
      handleRequestErrors(error);
      throw error?.response;
    });
};

export default Request;
