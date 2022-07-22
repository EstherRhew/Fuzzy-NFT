import React, {ChangeEvent, useState} from 'react';
import {useRecoilState} from "recoil";
import {loginStatusAtom, loginTokenAtom, profileAtom} from '../recoil/profile'
import {getUserData, getUserIdByEmail, getUserIdByName, login, signup} from "../service/user";
import xMark from '../assets/image/xmark-solid-red.svg'
import checkMark from '../assets/image/check-solid.svg'
import {debounce} from "lodash";

const DEFAULT_TAB = 'Login'
type AuthTab = 'Login' | 'Signup'

const LoginForm = () => {
  const [profile, setProfile] = useRecoilState(profileAtom)
  const [loginToken, setLoginToken] = useRecoilState(loginTokenAtom)

  const [loginForm, setLoginForm] = useState({
    name: '',
    password: ''
  })

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: ''
  })

  const [validName, setValidName] = useState<boolean | null>(null)
  const [validEmail, setValidEmail] = useState<boolean | null>(null)
  const [validPassword, setValidPassword] = useState<boolean | null>(null)
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null)

  const [authTab, setAuthTab] = useState<AuthTab>(DEFAULT_TAB)

  const onClickLogin = async (e: any) => {
    e.preventDefault()
    const {name, password} = loginForm
    const res = await login(name, password)
    if (!res) {
      alert('login failed')
      return;
    }
    const {data} = res
    localStorage.setItem('fuzzy', data.token)
    const userData = await getUserData(data._id)
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
      name: '',
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
    if (e.target.value === '') {
      setValidPassword(null)
      setPasswordMatch(null)
    }
    setSignupForm({
      ...signupForm,
      [e.target.id]: e.target.value
    })
  }

  const checkPasswordValid = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setValidPassword(null)
      return;
    }
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (e.target.value.match(regex)) {
      setValidPassword(true)
      return;
    }
    setValidPassword(false)
  }

  const checkPasswordMatch = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setPasswordMatch(null)
      return;
    }
    if (e.target.value === signupForm.password) {
      setPasswordMatch(true)
      return
    }
    setPasswordMatch(false)
  }

  const checkValidName = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setValidName(null)
      return;
    }
    if (e.target.value.length < 4) {
      setValidName(false)
      return
    }
    const existingUser = await getUserIdByName(e.target.value)
    if (existingUser) {
      setValidName(false)
    } else {
      setValidName(true)
    }

  }, 1000)

  const checkValidEmail =  debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setValidEmail(null)
      return;
    }
    if (e.target.value.length < 4) {
      setValidEmail(false)
      return
    }
    const existingUser = await getUserIdByEmail(e.target.value)
    if (existingUser) {
      setValidEmail(false)
    } else {
      setValidEmail(true)
    }

  }, 1000)

  switch (authTab) {
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
              <input id="password" type="password" placeholder="Your password" value={loginForm.password}
                     onChange={onChangeInput}/>
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
              <input id="name" type="text" placeholder="Your name" value={signupForm.name} onChange={(e) => {
                onChangeInput(e)
                checkValidName(e)
              }}/>
              {validName === null
                ? null
                : validName
                  ? <div className="input_valid"><img src={checkMark} alt=""/></div>
                  : <div className="input_valid invalid"><img src={xMark} alt=""/></div>
              }
            </div>
            <div className="input_item">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Your email" value={signupForm.email}
                     onChange={(e) => {
                       onChangeInput(e)
                       checkValidEmail(e)
                     }}/>
              {validEmail === null
                ? null
                : validEmail
                  ? <div className="input_valid"><img src={checkMark} alt=""/></div>
                  : <div className="input_valid invalid"><img src={xMark} alt=""/></div>
              }
            </div>
            <div className="input_item">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="8 characters with uppercase, lowercase, and number" value={signupForm.password}
                     onChange={onChangeInput} onBlur={checkPasswordValid}/>
              {validPassword === null
                ? null
                : validPassword
                  ? <div className="input_valid"><img src={checkMark} alt=""/></div>
                  : <div className="input_valid invalid"><img src={xMark} alt=""/></div>
              }
            </div>
            <div className="input_item">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input id="password_confirm" type="password" placeholder="Password confirm"
                     value={signupForm.password_confirm}
                     onChange={onChangeInput} onBlur={checkPasswordMatch}/>
              {passwordMatch === null
                ? null
                : passwordMatch
                  ? <div className="input_valid"><img src={checkMark} alt=""/></div>
                  : <div className="input_valid invalid"><img src={xMark} alt=""/></div>
              }
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
