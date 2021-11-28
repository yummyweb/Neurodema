import React, { useState } from "react"
import Input from "./Input"
import { useNavigate } from "react-router-dom"
import supabase from "../supabase"

function Register() {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [imei, setImei] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const registerUser = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      let { user, error } = await supabase.auth.signUp({
        email,
        password
      }, {
          data: {
              imei,
              radius: 2,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
          }
      })

      if (error) {
          setError(error.message)
      }
      else {
          setError(null)
          setSuccess(true)
          await supabase.from("users").insert({
            email,
            imei,
            radius: 2,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
      }
    }, () => alert("Please click allow so we know your location."))
  }

  return (
    <>
        <h1 className="title">Register</h1>
        <Input state={email} setState={setEmail} placeholder="Enter your email." />
        <Input isPassword state={password} setState={setPassword} placeholder="Enter your password." />
        <Input isImei state={imei} setState={setImei} placeholder="Enter your 15 digit device code." />
        <p className="link" onClick={() => navigate("/login")}>Already have an account? Login.</p>
        <div onClick={registerUser} className="register-button">Register</div>
        {error ? <p>{error}</p> : null}
        {success ? <p>Your account has been created. A confirmation email has been sent.</p> : null}
    </>
  )
}

export default Register
