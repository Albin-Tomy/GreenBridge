// src/components/MenuSection.js

import React from "react";
import Menubox from "./Menubox";

const MenuSection = ({ menu, setMenu, parentMenu }) => {
  return (
    <div className="menu-container">
      <div className="menus">
        <Menubox text={"Products"} action={setMenu} menu={menu} parentMenu={parentMenu} />
        <Menubox text={"Orders"} action={setMenu} menu={menu} parentMenu={parentMenu} />
        <Menubox text={"Staffs"} action={setMenu} menu={menu} parentMenu={parentMenu} />
        <Menubox text={"Users"} action={setMenu} menu={menu} parentMenu={parentMenu} />
      </div>
    </div>
  );
};

export default MenuSection;
