import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from '../supabase'
import Input from "./Input"

function Home() {
  const [user, setUser] = useState(null)
  const [radius, setRadius] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setUser(supabase.auth.user())
  })

  const logoutUser = async () => {
    let { error } = await supabase.auth.signOut()
    if (!error) {
      navigate("/")
    }
  }

  const updateRadius = async () => {
    let { error } = await supabase.auth.update({
      email: user.email,
      data: {
        imei: user.user_metadata.imei,
        radius: parseInt(radius),
        lat: user.user_metadata.lat,
        lng: user.user_metadata.lng
      }
    })

    if (error) {
      console.log(error)
    }
  }

  return (
    <>
        <img src="/logo.png" className="logo" />
        <h1 className="title">Neurodema</h1>
        {user ? (
          <>
            <Input isImei={true} state={radius} setState={setRadius} placeholder="Enter preferred radius." />
            <div onClick={updateRadius} className="auth-button">Set Radius</div>
            <div onClick={() => navigate("/track")} className="auth-button">Track</div>
            <div onClick={logoutUser} className="auth-button">Logout</div>
          </>
        ) : (
          <>
            <div onClick={() => navigate("/login")} className="auth-button">Login</div>
            <div onClick={() => navigate("/register")} className="auth-button">Register</div>
          </>
        )}
    </>
  );
}

export default Home;
