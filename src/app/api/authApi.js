
import { api } from "../lib/api";

export const signupUser = async (payload) => {
  const response = await api.post(
    "/auth/signup",
    payload
  );

  return response.data;
};

export const signupVerifyOtp = async (payload) => {
  const response = await api.post(
    "/auth/signup-verify-otp",
    payload
  );

  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};

export const loginVerifyOtp = async (payload) => {
  const response = await api.post(
    "/auth/login-verify-otp",
    payload
  );

  return response.data;
};

export const getMe = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};