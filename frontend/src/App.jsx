import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { UserProvider } from "./UserContext";

import About from "./pages/About"
import Home from "./pages/Home"
import ListView from "./pages/ListView"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import UserProfile from "./components/UserProfile"
import MarkdownPage from "./components/Markdownpage"
import CreatePostPage from "./pages/CreatePost"
import ExpandedPostPage from "./pages/ExpandedPost"
import UserList from "./pages/UserList";



function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />

}

function Register_user() {
  localStorage.clear()
  return <Register />
}


function App() {


  return (

    <UserProvider>
      <BrowserRouter>

        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* LISTVIEW */}
          <Route
            path="/listview"
            element={

              <ListView />

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
          {/* User Profile */}

          <Route
            path="/userprofile/:id"
            element={
              <UserProfile />

            }
          />

          <Route
            path="/users"
            element={
              <UserList />

            }
          />


          {/* <Route
            path="/myprofile"
            element={

              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>



            }
          /> */}

          {/* Post creation */}
          <Route
            path="/createpost"
            element={

              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>

            }
          />

          {/* Markdown */}
          <Route
            path="/markdowntext/:pk"
            element={

              <MarkdownPage />

            }
          />

          {/* Expanded Post*/}
          <Route
            path="/post/:id"
            element={
              <ExpandedPostPage />
            }

          />

          {/* NOTFOUND */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>
    </UserProvider>

  )
}

export default App;
