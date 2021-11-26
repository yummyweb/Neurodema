const express = require("express")
const cors = require("cors")
const axios = require("axios").default
const cron = require('node-cron')
const { createClient } = require('@supabase/supabase-js')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const { getDistanceFromLatLonInKm } = require('./utils')

const app = express()

const supabaseUrl = 'https://sxabzrnzazunvkshxgem.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjc4OTg2MCwiZXhwIjoxOTUyMzY1ODYwfQ.QKE-5Uvb80oz5JsE9fE9KTfx6TlfgqUpMhJE9Hmp0fE'
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/", (req, res, next) => {
  axios({
    url: "http://34.146.117.200:8000/subgraphs/name/iotex/pebble-subgraph",
    method: "post",
    data: {
      query: `
          {
            deviceRecords(orderBy: timestamp, first: 1, orderDirection: desc, where: { imei: "${req.body.imei}"}) {
              raw # !! Protobuf encoded sensors values
              imei
              signature,timestamp
            }
          }`,
    },
  })
    .then((result) => {
      res.statusCode = 200;
      res.send(result.data);
    })
    .catch((error) => {
      console.log("error: ", error);
      res.statusCode = 400;
      res.send({ data: { deviceRecords: [] } });
    })
})

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'antriksh.timepass@gmail.com',
    pass: 'pokepoke@123'
  }
}))

cron.schedule('* * * * *', () => {
  supabase.from("users").select("*")
  .then(res => {
    res.data.forEach(d => {
      const distance = getDistanceFromLatLonInKm(d.lat, d.lng, 29, 78)
      console.log(distance)
      // const mailOptions = {
      //   from: 'antriksh.timepass@gmail.com',
      //   to: d.email,
      //   subject: 'Neurodema Alert',
      //   text: 'Your tracker is out of tracking radius.'
      // }

      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error)
      //   } else {
      //     console.log('Email sent: ' + info.response)
      //   }
      // })
    })
  })
  .catch(err => {
    console.log(err)
  })
})

app.listen(process.env.PORT || 5000, () => console.log("Server started on port 5000"))
