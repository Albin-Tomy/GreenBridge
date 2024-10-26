// src/components/TableSection.js

import React from "react";
import BasicTable from "./BasicTable";

const TableSection = ({ rows, columns }) => {
  return (
    <div className="table-wrapper">
      <div className="table-container">
        <BasicTable rows={rows} columns={columns} />
      </div>
    </div>
  );
};

export default TableSection;
