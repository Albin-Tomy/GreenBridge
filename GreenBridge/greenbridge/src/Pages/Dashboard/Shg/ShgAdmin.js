import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Menubox from "../../../components/Menubox";
import { Outlet ,useNavigate} from "react-router-dom"; // This will render the child components

function Admin() {
  const [menu, setMenu] = useState("");
  const [parentMenu, setParentMenu] = useState("");
  const navigate = useNavigate(); 

  const handleMenuChange = (newMenu) => {
    setMenu(newMenu);
    setParentMenu(newMenu);
    
    if (newMenu === "Products") {
        navigate("products"); // Navigate to the products route
      } else if (newMenu === "Orders") {
        navigate("orders"); // Navigate to the orders route
      }

  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="menu-container">
          <div className="menus">
            <Menubox text={"Products"} action={handleMenuChange} menu={menu} parentMenu={parentMenu} />
            <Menubox text={"Orders"} action={handleMenuChange} menu={menu} parentMenu={parentMenu} />
          </div>
        </div>
        <div className="content-wrapper">
          <Outlet /> {/* Renders the corresponding page based on the route */}
        </div>
      </div>
    </div>
  );
}

export default Admin;
