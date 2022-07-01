import axios from "axios";
import configs from "../config";

export const login = async (email: string, password: string) => {
  try {
    const data = {email, password}
    const res = await axios.post(`${configs.USER_API_URL}/login`, data)
    return res
  } catch(err) {
    console.error(`Login failed: ${err}`);
    return null;
  }
}