import React, {useEffect, useState} from 'react';
import ListLayout from "../components/ListLayout";
import {useRecoilState, useRecoilValue} from "recoil";
import {myListAtom} from "../recoil/list";
import {getMyList} from "../service/contract";
import {useNavigate, useParams} from "react-router-dom";
import profileIcon from "../assets/image/user-solid.svg";
import Header from "../components/Header";
import {IProfile, loginTokenAtom, profileAtom} from "../recoil/profile";
import {modalAtom} from "../recoil/modal";
import Modal from '../components/modal/Modal'
import {IUploadedItem} from "../type/type";
import {getUserData, getUserIdByName, uploadProfileImage} from "../service/user";

const ProfilePage = () => {
  const [myList, setMyList] = useRecoilState(myListAtom)
  const {userName} = useParams()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useRecoilState(profileAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const navigate = useNavigate()
  const [currentProfile, setCurrentProfile] = useState<IProfile>()
  const loginToken = useRecoilValue(loginTokenAtom)
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<any>()

  const getCurrentProfileData = async () => {
    if (!userName) {
      return;
    }
    const userId = await getUserIdByName(userName)
    const userData = await getUserData(userId)
    setCurrentProfile(userData)
  }

  const getMyItems = async () => {
    if (!currentProfile) {
      return
    }
    let updatedList: IUploadedItem[] = []
    const list = await Promise.all(currentProfile.walletAddress.map(async (address) => {
      return await getMyList(address, loginToken)
    }))

    for (let i = 0; i < list.length; i++) {
      list[i].map((item) => {
        updatedList.push(item)
      })
    }
    setMyList(updatedList)
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setPreview(URL.createObjectURL(file));
    setFile(file)
  }

  const onSaveFile = async (e: any) => {
    e.preventDefault();
    if (!file || !profile) {
      return;
    }

    const formData = new FormData();
    formData.append("profile_img", file);
    formData.append("user_id", profile.userId)
    const updatedUser = await uploadProfileImage(profile.userId, formData)
    if (updatedUser && currentProfile) {
      setProfile({
        ...profile,
        image: URL.createObjectURL(file)
      })
    }
    setPreview('')
  }

  useEffect(() => {
    setLoading(true)
    getMyItems()
      .then(() => setLoading(false))

    return () => setMyList([])
  }, [currentProfile])

  useEffect(() => {
    getCurrentProfileData()
    console.log(profile, 'profile')
  }, [userName])


  useEffect(() => {
    if (profile == undefined) {
      navigate('/')
    }
  }, [profile])

  return (
    <>
      <Header/>
      <main className="mypage">
        <div className="profile">
          {profile?.name === currentProfile?.name
            ? <form onSubmit={onSaveFile} name="profile_img" encType="multipart/form-data">
              <input id="file" type="file" accept="image/*" onChange={handleFileChange} className="input_upload"/>
              <label htmlFor="file" className="label_upload">
                <div className="img_box">
                  {profile?.image && preview === ''
                    ? <img src={profile.image} alt="" className="info_img"/>
                    : <img src={preview === '' ? profileIcon : preview} alt="" className="info_img preview"/>
                  }
                </div>
              </label>
              {preview !== '' && <button type="submit" className="btn profile_change">Save</button>}
            </form>
            : <div className="img_box">
              {currentProfile?.image
                ? <img src={currentProfile.image} alt="" className="info_img"/>
                : <img src={profileIcon} alt="" className="info_img preview"/>
              }
            </div>
          }

          <div className="profile_info">
            <span className="profile_name">{currentProfile?.name}</span>
            {profile?.name === currentProfile?.name
              ? <div className="profile_wallet">
                <button className="wallet_btn" onClick={() => setModal('WalletManage')}>지갑계정관리</button>
                <span className="wallet_info">연결된 지갑
                <span className="red"> ({currentProfile?.walletAddress.length})</span>
              </span>
              </div>
              : <div className="profile_wallet">
                {/*<button className="wallet_btn" onClick={() => setModal('WalletManage')}>지갑계정관리</button>*/}
                <span className="wallet_info">연결된 지갑
                <span className="red"> ({currentProfile?.walletAddress.length})</span>
              </span>
              </div>
            }


          </div>
        </div>

        <h4>Photos</h4>
        <ListLayout list={myList} loading={loading}/>
      </main>
      {modal === 'WalletManage' && <Modal type='walletManage'/>}
    </>
  );
};

export default ProfilePage;

