import axios from "axios";
import config from "../config";

export const login = async (email: string, password: string) => {
  try {
    const data = {email, password}
    const res = await axios.post(`${config.USER_API_URL}/login`, data)
    return res
  } catch (e) {
    console.error(`Login failed: ${e}`);
  }
}

export const signup = async (name: string, email: string, password: string) => {
  try {
    const data = {name, email, password}
    const res = await axios.post(`${config.USER_API_URL}/signup`, data)
    console.log(res, 'res')
    return res
  } catch (e) {
    console.error(`Signup failed: ${e}`)
  }
}