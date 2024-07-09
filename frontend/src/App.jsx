import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import About from "./pages/About"
import Home from "./pages/Home"
import ListView from "./pages/ListView"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />

}

function Register_user (){
  localStorage.clear()
  return <Register />
}


function App() {


  return (

    <BrowserRouter>
  
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* LISTVIEW */}
        <Route
          path="/listview"
          element={
            <ProtectedRoute>
              <ListView />
            </ProtectedRoute>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register_user />}
        />

        {/* LOGOUT */}
        <Route
          path="/logout"
          element={<Logout />}
        />

        {/* NOTFOUND */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      
    </BrowserRouter>

  )
}

export default App;
