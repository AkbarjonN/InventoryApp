import axios from "axios";

export const loginUser = async (email, password) => {
  const res = await axios.post("/api/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};
