import React, { useState } from "react"
import Input from "./Input"
import { useNavigate } from "react-router-dom"
import supabase from "../supabase"

function Login() {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const loginUser = async () => {
    let { user, error } = await supabase.auth.signIn({
        email,
        password
    })

    if (error) {
        setError(error.message)
    }
    else {
        navigate("/")
    }
  }

  return (
    <>
        <h1 className="title">Login</h1>
        <Input state={email} setState={setEmail} placeholder="Enter your email." />
        <Input state={password} setState={setPassword} placeholder="Enter your password." />
        <p className="link" onClick={() => navigate("/register")}>Don't have an account? Register.</p>
        <div onClick={loginUser} className="register-button">Login</div>
        {error ? <p>{error}</p> : null}
    </>
  )
}

export default Login
