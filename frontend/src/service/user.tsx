import axios from "axios";
import config from "../config";
import {caver} from "../klaytn/caver";

export const login = async (name: string, password: string) => {
  try {
    const data = {name, password}
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

export const addWalletAddress = async (name: string, address: string) => {
  try {
    console.log(name, address)
    const signature = await caver.klay.sign(name, address)
    console.log(11111)
    const data = {name, address, signature}
    console.log(22222)
    const res = await axios.post(`${config.USER_API_URL}/addWalletAddress`, data)
    console.log(res, 'add wallet res')
  } catch (e) {
    console.error(`Wallet add failed: ${e}`)
  }
}

export const getUserData = async (userName: string) => {
  try {
    const {data} = await axios.get(`${config.USER_API_URL}/user/${userName}`)
    const { name, email, wallet_address, image } = data.userData
    return {
      name,
      email,
      walletAddress: wallet_address,
      image
    }
  } catch (e) {

  }
}