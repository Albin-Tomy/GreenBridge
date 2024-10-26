// src/components/ActionButtons.js

import React from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ActionButtons = ({ handleAdd, handleEdit, handleDelete, addButtonLabel }) => {
  return (
    <>
      <div className="add-button-container">
        <button className="add-button" onClick={handleAdd}>+ {addButtonLabel}</button>
      </div>
      <div>
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </>
  );
};

export default ActionButtons;
