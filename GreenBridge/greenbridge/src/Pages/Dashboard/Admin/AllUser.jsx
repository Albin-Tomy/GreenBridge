import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { format } from "date-fns";
import { getIUserById, findInactiveItems } from "../Shg/helper";

import AddUserForm from "../../../components/Forms/AddUser";
import EditUserForm from "../../../components/Forms/EditUser";

function AllUsersDashboard() {
  const [users, setUsers] = useState();
  const [usersResponse, setUsersResponse] = useState();
  const [selectedUser, setSelecteduser] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(usersResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(lowercasedTerm) ||
            String(user.id).includes(lowercasedTerm)
        )
      );
    } else {
        setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const getAllUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/auth/users/")
      .then((response) => {
        setUsersResponse(response.data);
        console.log("response.data---", response.data);
        const transformedData = transformUsersData(response.data);
        console.log("transformedData", transformedData);
        setUsers(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformUsersData = (data) => {
    return data.map(user => ({
        id: user.id,
        email: user.email,
        isSuperuser: user.is_superuser,
        isStaff: user.is_staff,
        isActive: user.is_active,
        dateJoined: new Date(user.date_joined).toLocaleDateString(),
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        profileCompleted: user.is_profile_completed,
        createdAt: new Date(user.created_at).toLocaleString(),
        updatedAt: new Date(user.updated_at).toLocaleString(),
    }));
};

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const user = getIUserById(row?.id, users);
    setSelecteduser(user);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelecteduser(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteUser = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/auth/users/${selectedUser?.id}/delete/`
      )
      .then((response) => {
        alert("user deleted");
        setDeleteModalOpen(false);
        setUsers((prevmadeOfs) =>
          prevmadeOfs.filter(
            (madeof) => madeof.madeof_id !== selectedUser.madeof_id
          )
        );
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableUser = (row) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/auth/disable-enable-user/${row?.id}/`
      )
      .then((response) => {
        getAllUsers();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  console.log("selectedUser", selectedUser);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "Email",
        accessor: "email",
      },
      { Header: "Joined on", accessor: "dateJoined" },
      { Header: "Profile completed", accessor: "profileCompleted" ,Cell: ({ value }) => (value ? "Yes" : "No"),},
      { Header: "Staff privilege", accessor: "isStaff" ,Cell: ({ value }) => (value ? "Yes" : "No")},
      { Header: "Is Admin", accessor: "isSuperuser" ,Cell: ({ value }) => (value ? "Yes" : "No")},
      { Header: "Updated On", accessor: "updatedAt" },
      { Header: "Last login", accessor: "lastLogin" },

      
    //   {
    //     Header: "Status",
    //     accessor: "isActive",
    //     Cell: ({ value }) => (value ? "Active" : "Inactive"),
    //   },
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info">
          <div className="info-title">Total users</div>
          <div className="info-value success">{users?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive users</div>
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
          Add User
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={ filteredUsers ??[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableUser}
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
          <AddUserForm onCancel={handleCloseForm} onConfirm={getAllUsers} />
        }
        // customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditUserForm
            onCancel={handleEditFormClose}
            onConfirm={getAllUsers}
            user={selectedUser}
          />
        }
        // customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}
      />
    </div>
  );
}

export default AllUsersDashboard;