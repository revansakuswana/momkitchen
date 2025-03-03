import { Routes, Route } from "react-router-dom";
import Home from "@pages/Home.jsx";
import Signin from "@pages/Signin.jsx";
import Signup from "@pages/Signup.jsx";
import Menu from "@pages/Menu.jsx";
import AddFood from "@pages/AddFood.jsx";
import MyOrder from "@pages/MyOrder.jsx";
import ListOrder from "@pages/ListOrder.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users-signin" element={<Signin />} />
      <Route path="/users-signup" element={<Signup />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/list-order" element={<ListOrder />} />
      <Route path="/my-order" element={<MyOrder />} />
      <Route path="/add-food" element={<AddFood />} />
    </Routes>
  );
};

export default Routers;
