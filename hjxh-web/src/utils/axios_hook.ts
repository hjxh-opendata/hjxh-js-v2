import axios from "axios";
import { AXIOS_BASE_URL } from "../const";

const $ = axios.create({
  baseURL: AXIOS_BASE_URL,
  withCredentials: true
});

export default $;
