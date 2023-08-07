import axios from "axios";

export const client = axios.create({});

export const slowClient = axios.create({});
slowClient.interceptors.response.use(async (response) => {
  await new Promise((v) => setTimeout(v, 1000));
  return response;
});