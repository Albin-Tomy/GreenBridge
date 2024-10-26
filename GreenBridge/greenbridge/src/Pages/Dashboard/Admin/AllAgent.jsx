import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
// import { format } from "date-fns";
import { getStaffById, findInactiveItems } from "../Shg/helper";

import AddStaffForm from "../../../components/Forms/AddAgent";
import EditStaffForm from "../../../components/Forms/EditAgent";

function AllStaffsDashboard() {
  const [staffs, setStaffs] = useState();
  const [staffsResponse, setStaffsResponse] = useState();
  const [selectedStaff, setSelectedStaff] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(staffsResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStaffs, setFilteredStaffs] = useState([]);

  useEffect(() => {
    getAllStaffs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredStaffs(
        staffs.filter(
          (staff) =>
            staff.first_name.toLowerCase().includes(lowercasedTerm) ||
            staff.last_name.toLowerCase().includes(lowercasedTerm) ||
            staff.designation.toLowerCase().includes(lowercasedTerm) ||
            String(staff.staff_id).includes(lowercasedTerm) ||
            String(staff.user_id).includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredStaffs(staffs);
    }
  }, [searchTerm, staffs]);

  const getAllStaffs = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/staffs/list/")
      .then((response) => {
        setStaffsResponse(response.data);
        console.log("response.data---", response.data);
        const transformedData = transformStaffData(response.data);
        console.log("transformedData", transformedData);
        setStaffs(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformStaffData = (dataArray) => {
    return dataArray.map((data) => ({
      staff_id: data.staff_id,
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      designation: data.designation,
      hire_date: new Date(data.hire_date).toLocaleDateString("en-US"),
      salary: data.salary,
      updatedAt: new Date(data.updated_at).toLocaleDateString("en-US"),
      isActive: data.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const staff = getStaffById(row?.staff_id, staffsResponse);
    setSelectedStaff(staff);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelectedStaff(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteUser = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/staffs/delete/${selectedStaff?.staff_id}/`
      )
      .then((response) => {
        alert("staff deleted");
        setDeleteModalOpen(false);
        setStaffs((prevmadeOfs) =>
          prevmadeOfs.filter(
            (madeof) => madeof.madeof_id !== selectedStaff.madeof_id
          )
        );
        getAllStaffs();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableStaff = (row) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/staffs/disable-enable-staff/${row?.staff_id}/`
      )
      .then((response) => {
        getAllStaffs();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  console.log("selectedStaff", selectedStaff);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "staff_id" },
      {
        Header: "User id",
        accessor: "user_id",
      },

      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Designation", accessor: "designation" },
      { Header: "Hired On", accessor: "hire_date" },
      { Header: "Salary", accessor: "salary" },
      { Header: "Updated On", accessor: "updatedAt" },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (value ? "Active" : "Inactive"),
      },
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info">
          <div className="info-title">Total staffs</div>
          <div className="info-value success">{staffs?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive staffs</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Staffs
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredStaffs ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableStaff}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteUser}
        heading={`Delete madeof`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddStaffForm onCancel={handleCloseForm} onConfirm={getAllStaffs} />
        }
        customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}

      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditStaffForm
            onCancel={handleEditFormClose}
            onConfirm={getAllStaffs}
            staffDetails={selectedStaff}
          />
        }
        customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}
      />
    </div>
  );
}

export default AllStaffsDashboard;