import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accountAtom, storageStatusAtom} from "../recoil/account";
import {loginStatusAtom, loginTokenAtom, profileAtom} from '../recoil/profile'
import {modalAtom} from "../recoil/modal";
import {getUserData, login, signup} from "../service/user";

const DEFAULT_TAB = 'Login'
type AuthTab = 'Login' | 'Signup'

const LoginForm = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [storageStatus, setStorageStatus] = useRecoilState(storageStatusAtom)
  const setModal = useSetRecoilState(modalAtom)
  const loginStatus = useRecoilValue(loginStatusAtom)
  const [profile, setProfile] = useRecoilState(profileAtom)
  const [loginToken, setLoginToken] = useRecoilState(loginTokenAtom)

  const [loginForm, setLoginForm] = useState({
    name: '',
    password: ''
  })

  const [signupForm, setSignupForm] = useState({
    name:'',
    email: '',
    password: '',
    password_confirm: ''
  })

  const [authTab, setAuthTab] = useState<AuthTab>(DEFAULT_TAB)

  const onClickLogin = async (e?: any) => {
    e.preventDefault()
    const {name, password} = loginForm
    const res = await login(name, password)
    if (!res) {
      alert('login failed')
      return;
    }
    const {data} = res
    localStorage.setItem('fuzzy', data.token)
    console.log(data, 'login data')
    const userData = await getUserData(data._id)
    console.log(data.token, 'login token')
    setLoginToken(data.token)
    setProfile(userData)
  }

  const onClickJoin = async (e: any) => {
    e.preventDefault();
    const {name, email, password} = signupForm
    const res = await signup(name, email, password)
    if (!res) {
      alert('signup failed')
      return;
    }
    alert('signup successfully done!')
    setSignupForm({
      name:'',
      email: '',
      password: '',
      password_confirm: ''
    })
    setAuthTab('Login')
    setLoginForm({
      ...loginForm,
      name
    })
  }

  const onChangeInput = (e: any) => {
    if (authTab === 'Login') {
      setLoginForm({
        ...loginForm,
        [e.target.id]: e.target.value
      })
      return
    }
    setSignupForm({
      ...signupForm,
      [e.target.id]: e.target.value
    })
  }

  useEffect(() => {
    console.log(profile, 'profile')
  }, [profile])

  switch (authTab){
    case 'Login':
      return (
        <div className="auth_box">
          <h4>Let's Get Started!</h4>
          <form action="src/components/LoginForm" className="auth_form">
            <div className="input_item">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your name" value={loginForm.name} onChange={onChangeInput}/>
            </div>
            <div className="input_item">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Your password" value={loginForm.password} onChange={onChangeInput}/>
            </div>
            <button onClick={onClickLogin}>Login</button>
          </form>
          <div className="auth_footer">
            <span>Don't have an account yet?</span>
            <button onClick={() => setAuthTab('Signup')}>Join</button>
          </div>
        </div>
      );
    case 'Signup':
      return (
        <div className="auth_box">
          <h4>Let's Get Started!</h4>
          <form action="src/components/LoginForm" className="auth_form">
            <div className="input_item">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your name" value={signupForm.name} onChange={onChangeInput}/>
            </div>
            <div className="input_item">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Your email" value={signupForm.email} onChange={onChangeInput}/>
            </div>
            <div className="input_item">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Your password" value={signupForm.password} onChange={onChangeInput}/>
            </div>
            <div className="input_item">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input id="password_confirm" type="password" placeholder="Password confirm" value={signupForm.password_confirm} onChange={onChangeInput}/>
            </div>
            <button onClick={onClickJoin}>Join</button>
          </form>
          <div className="auth_footer">
            <span>Already have an account?</span>
            <button onClick={() => setAuthTab('Login')}>Login</button>
          </div>
        </div>
      );
    default:
      return null
  }

};

export default LoginForm;
