import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { format } from "date-fns";
import { getMadeofById, getItemById, findInactiveItems } from "../Shg/helper";
import AddMadeofForm from "../../../components/Forms/AddMaterialForm";
import EditMadeofForm from "../../../components/Forms/EditMaterial";

function MadeofDashboard() {
  const [madeOfs, setMadeOfs] = useState();
  const [madeofResponse, setMadeofResponse] = useState();
  const [selectedMadeof, setSelectedMadeof] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(madeofResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getAllmadeOfs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(
        madeOfs.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.description.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredProducts(madeOfs);
    }
  }, [searchTerm, madeOfs]);

  const getAllmadeOfs = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/madeof-list/")
      .then((response) => {
        setMadeofResponse(response.data);
        console.log("response.data", response.data);
        const transformedData = transformData(response.data);
        console.log("transformedData", transformedData);
        setMadeOfs(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformData = (madeofDataArray) => {
    return madeofDataArray.map((madeofData) => ({
      madeof_id: madeofData.madeof_id,
      name: madeofData.name,
      description: madeofData.description,
      created_at: format(new Date(madeofData.created_at), "yyyy-MM-dd HH:mm"),
      updated_at: format(new Date(madeofData.updated_at), "yyyy-MM-dd HH:mm"),
      isActive: madeofData.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const madeof = getMadeofById(row?.madeof_id, madeOfs);
    setSelectedMadeof(madeof);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelectedMadeof(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deletecountry = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/products/madeof-delete/${selectedMadeof?.madeof_id}/`
      )
      .then((response) => {
        alert("madeof deleted");
        setDeleteModalOpen(false);
        setMadeOfs((prevmadeOfs) =>
          prevmadeOfs.filter(
            (madeof) => madeof.madeof_id !== selectedMadeof.madeof_id
          )
        );
        getAllmadeOfs();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisablecountry = (row) => {
    console.log("row--", row);
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/products/disable-enable-madeof/${row?.madeof_id}/`
      )
      .then((response) => {
        getAllmadeOfs();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  console.log("selectedMadeof", selectedMadeof);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "madeof_id" },
      {
        Header: "madeof",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <strong>{row.original.name}</strong>
            <div className="admin-table-subtext">
              {row.original.description}
            </div>
          </div>
        ),
      },
      { Header: "Created On", accessor: "created_at" },
      { Header: "Updated On", accessor: "updated_at" },
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
          <div className="info-title">Total madeOfs</div>
          <div className="info-value success">{madeOfs?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive madeOfs</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Madeof..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add MadeOf
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisablecountry}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deletecountry}
        heading={`Delete madeof`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddMadeofForm onCancel={handleCloseForm} onConfirm={getAllmadeOfs} />
        }
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditMadeofForm
            onCancel={handleEditFormClose}
            onConfirm={getAllmadeOfs}
            initialMadeOfData={selectedMadeof}
          />
        }
      />
    </div>
  );
}

export default MadeofDashboard;