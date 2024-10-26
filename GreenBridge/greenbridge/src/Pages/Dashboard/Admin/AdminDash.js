import React, { useEffect, useState } from "react";
import "./AdminDash.css";
import Sidebar from "../../../components/SideBar";
import ProductDashboard from "../../Dashboard/Admin/ProductDashboard";

import axios from "axios";
import CategoryDashboard from "./CategoryDashboard";
// import CountryDashboard from "./CountryDashboard";
import MadeofDashboard from "./MaterialDashboard";
import AllUsersDashboard from "./AllUser";
import AllStaffsDashboard from "./AllAgent";
import Welcome from "./Welcome";
import AllOrdersDashboard from "./AllOrder";

function AdminDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("welcome");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/category-list/")
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("categories", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/brand-list/")
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("brands", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/country-list/")
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("countries", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/madeof-list/")
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("madeOf", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="dashboard-main-container">
      <div className="sidebar-main-container">
        <Sidebar setSelectedMenu={setSelectedMenu} />
      </div>
      <div className="content-container">
        <div className="content">
        
          {selectedMenu === "welcome" ?
          <Welcome/>:
          selectedMenu === "allProducts" ? (
            <ProductDashboard />
          ) : selectedMenu === "categories" ? (
            <CategoryDashboard/>
          ): selectedMenu === "madeOf" ? (
            <MadeofDashboard/>
          ) : selectedMenu === "allOrders" ? (
            <AllOrdersDashboard/>
          ) : selectedMenu === "newOrders" ? (
            "New Orders"
          ) : selectedMenu === "allStaffs" ? (
            <AllStaffsDashboard/>
          ) : selectedMenu === "deactivatedStaffs" ? (
            "Deactivated Staffs"
          ) : selectedMenu === "allUsers" ? (
            <AllUsersDashboard/>
          ) : selectedMenu === "deactivatedUsers" ? (
            "Deactivated Users"
          ) : (
            "No Data Found"
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;