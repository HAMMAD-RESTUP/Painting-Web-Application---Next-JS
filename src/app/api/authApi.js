
import { api } from "../lib/api";

export const signupUser = async (formData) => {
  const { data } = await api.post("/auth/signup", formData);
  return data;
};

export const signupVerifyOtp = async (formData) => {
  const { data } = await api.post("/auth/signup-verify-otp", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await api.post("/auth/login", formData);
  return data;
};

export const loginVerifyOtp = async (formData) => {
  const { data } = await api.post("/auth/login-verify-otp", formData);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};