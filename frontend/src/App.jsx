import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./UserContext";
import About from "./pages/About";
import Home from "./pages/Home";
import ListView from "./pages/ListView";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import MarkdownPage from "./components/Markdownpage";
import CreatePostPage from "./pages/CreatePost";
import ExpandedPostPage from "./pages/ExpandedPost";
import UserList from "./pages/UserList";
import MyProfile from "./pages/MyProfile";


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function Register_user() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listview" element={<ListView />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register_user />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/userprofile/:id" element={<UserProfile />} />
        <Route path="/users" element={<UserList />} />

        <Route path="/createpost" element={
          
            <ProtectedRoute>
              <UserProvider>
              <CreatePostPage />
              </UserProvider>
            </ProtectedRoute>

        } />

        <Route path="/myprofile" element={
          
            <ProtectedRoute>
              <UserProvider>
              <MyProfile />
              </UserProvider>
            </ProtectedRoute>
          
        } />

        <Route path="/markdowntext/:pk" element={<MarkdownPage />} />
        <Route path="/post/:id" element={<ExpandedPostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;

