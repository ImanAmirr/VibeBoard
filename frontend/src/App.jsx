import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppNavbar from "./components/Appnavbar";

import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Boards from "./pages/boards";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function AppLayout() {
  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/boards" element={<Boards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}