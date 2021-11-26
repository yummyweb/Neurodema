import React, { useState, useEffect } from "react"
import Map from "./Map"
import axios from "axios"
import protobuf from "protobufjs"
import pebble from "./pebble.proto"
import supabase from "../supabase"
import { useNavigate } from "react-router-dom"

function Track() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [data, setData] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    setUser(supabase.auth.user())
  })

  useEffect(() => {
    if (user) {
      axios.post("https://neurodema-api.herokuapp.com/", {
        imei: user.user_metadata.imei,
        radius: user.user_metadata.radius
      })
      .then(res => {
        if (res.data.data.deviceRecords === []) {
          setEmpty(true)
        }
        else {
          protobuf.load(pebble)
          .then(def => {
            const SensorData = def.lookupType('SensorData')
            const encodedTelemetry = res.data.data.deviceRecords[0].raw.replace(/0x/g, '')
            const telemetry = SensorData.decode(Buffer.from(encodedTelemetry,"hex"))
            const latitude = telemetry.latitude
            const latLen = latitude.toString().length-2
            const latTotal = new Array(latLen).fill(10).reduce((a, b) => a * b)
            const longitude = telemetry.longitude
            const lngLen = longitude.toString().length-2
            const lngTotal = new Array(lngLen).fill(10).reduce((a, b) => a * b)
            
            setData({
              timestamp: res.data.data.deviceRecords[0].timestamp,
              lat: latitude/latTotal,
              lng: longitude/lngTotal,

            })
          })
          .catch(_err => {
            console.log(_err)
            setError(true)
          })
        }
      })
      .catch((err) => {
        console.log(err)
        setError(true)
      })
    }
  }, [user])

  return (
    <>
        <h1>Track Location</h1>
        {error ? <p>Error: Fetching device</p> : null}
        {empty ? <p>Error: Invalid device code</p> : null}
        {data ? (
          <>
            <p>Monitoring for radius: { user.user_metadata.radius } km</p>
            <Map lat={data.lat} lng={data.lng} loadingElement={<div style={{ height: `100%` }} />} isMarkerShown googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFo1jMUoGLQiKp5CGDY81IsydL4__GZTU&v=3.exp&libraries=geometry,drawing,places" mapElement={<div style={{ height: `100%`, borderRadius: "10px" }} />} containerElement={<div style={{ height: `500px`, width: `700px` }} />} />
          </>
        ) : null}
        <div onClick={() => navigate("/")} className="auth-button">← Go back</div>
    </>
  );
}

export default Track;
