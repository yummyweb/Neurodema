import { useEffect, useState } from "react"
import './App.css';
import Home from "./components/Home"
import Track from "./components/Track"
import Register from "./components/Register"
import Login from "./components/Login"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import supabase from './supabase'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(supabase.auth.user())
  })
  return (
    <Router>
      <div className="App">
        <Routes>
          {user ? <Route exact path="/track" element={<Track />} /> : null}
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
