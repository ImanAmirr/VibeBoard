import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppNavbar from "./components/Appnavbar";

import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Boards from "./pages/boards";
import Board from "./pages/board";
import CreateItem from "./pages/createItem";
import EditItem from "./pages/editItem";
import createBoard from "./pages/createBoard";
import CreateBoard from "./pages/createBoard";

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
          <Route path="/boards/:boardId/items" element={<Board />} />
          <Route path="/boards/:boardId/items/new" element={<CreateItem />} />
          <Route path="/boards/:boardId/items/:itemId/edit" element={<EditItem />} />
          <Route path="/boards/new" element={<CreateBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}