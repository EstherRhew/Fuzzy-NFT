import axios, {AxiosError} from "axios";
import config from "../config";
import {caver} from "../klaytn/caver";
import {ServerError} from "../type/type";

const headers = (token: string) => {
  return ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
}

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
    return res
  } catch (e) {
    console.error(`Signup failed: ${e}`)
  }
}

export const checkTokenValidity = async (token: string) => {
  try {
    const res = await axios.get(`${config.USER_API_URL}/verifyToken/${token}`)
    return res.data
  } catch (e) {
    console.error(e)
  }
}

export const addWalletAddress = async (name: string, address: string, token: string) => {
  try {
    const signature = await caver.klay.sign(name, address)
    const data = {name, address, signature}
    const res = await axios.post(`${config.USER_API_URL}/addWalletAddress`, data, {
      headers: {Authorization: `Bearer ${token}`}
    })
    return res
  } catch (e) {
    const error = e as AxiosError
    // console.error(`Wallet add failed: ${error}`)
    // @ts-ignore
    return {error: error.response.data}
  }
}

export const deleteWalletAddress = async (name: string, address: string, token: string) => {
  try {
    const signature = await caver.klay.sign(name, address)
    const data = {name, address, signature}
    const res = await axios.post(`${config.USER_API_URL}/deleteWalletAddress`, data, {
      headers: {Authorization: `Bearer ${token}`}
    })
    return res
  } catch (e) {
    console.error(`Delete wallet failed: ${e}`)
  }
}

export const getUserData = async (userId: string) => {
  try {
    const {data} = await axios.get(`${config.USER_API_URL}/user/${userId}`)
    const { _id, name, email, wallet_address, image } = data.userData
    return {
      userId,
      name,
      email,
      walletAddress: wallet_address,
      image
    }
  } catch (e) {
    console.error(`Get userData failed: ${e}`)
  }
}

export const getUserIdByName = async (userName: string) => {
  try {
      const {data} = await axios.get(`${config.USER_API_URL}/userIdByName/${userName}`)
      return data.userId
  } catch (e) {
    console.error(`getUserIdByName failed: ${e}`)
  }
}

export const getUserIdByAddress = async (address: string) => {
  try {
      const _address = address.toLowerCase()
      const {data} = await axios.get(`${config.USER_API_URL}/userIdByAddress/${_address}`)
      return data.userId
  } catch (e) {
    console.error(`getUserIdByAddress failed: ${e}`)
  }
}

export const getUserIdByEmail = async (email: string) => {
  try {
    const {data} = await axios.get(`${config.USER_API_URL}/userIdByEmail/${email}`)
    return data.userId
  } catch (e) {
    console.error(`getUserIdByEmail failed: ${e}`)
  }
}

export const uploadProfileImage = async (userId: string, formData: any) => {
  try {
    const res = await axios.put(`${config.USER_API_URL}/uploadProfileImage`, formData)
    console.log(res, 'upload res')
    return res.data
  } catch (e) {
    console.error(`photo upload failed: ${e}`)

  }
}