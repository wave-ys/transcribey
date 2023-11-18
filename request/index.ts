import axios from "axios";
import * as process from "process";

export const clientRequest = axios.create();
export const serverRequest = axios.create({
  baseURL: process.env.API_PATH
})