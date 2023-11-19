import axios from "axios";
import * as process from "process";

export const request = axios.create({
  baseURL: process.env.API_PATH
});