import {caver} from "./caver";
import GalleryAbi from './abi/GalleryAbi.json'
import config from "../config";

const GalleryContract = new caver.klay.Contract(GalleryAbi.abi, config.CONTRACT_ADDRESS)

export default GalleryContract