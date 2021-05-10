import axios from "axios";
import { API_BASE_URL } from "../const";

const $ = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default $;
