import React from 'react';
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import "./DataTable.css";

const DataTable = ({ columns, data, onEdit, onDelete, onToggleStatus ,hideActiveButton,showViewMoreIcon,onShowMoreDetails}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
    previousPage,
    nextPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  return (
    <div className="admin-table-container">
      <table {...getTableProps()} className="admin-custom-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
                <td>
                  <button
                    className="admin-action-btn admin-edit-btn"
                    onClick={() => onEdit(row.original)}
                  >
                    <FaEdit  style={{fontSize:'24px'}}/>
                  </button>
                  <button
                    className="admin-action-btn admin-delete-btn"
                    onClick={() => onDelete(row.original)}
                  >
                    <FaTrashAlt  style={{fontSize:'20px'}}/>
                  </button>
                  {!hideActiveButton &&
                  <button
                    className="admin-action-btn admin-toggle-btn"
                    onClick={() => onToggleStatus(row.original)}
                  >
                    {row.original.isActive ? (
                      <FaToggleOn scale={2}  style={{fontSize:'32px'}}/>
                    ) : (
                      <FaToggleOff  style={{fontSize:'32px'}}/>
                    )}
                  </button>
                  }
                   {showViewMoreIcon &&
                  <button
                    className="admin-action-btn admin-toggle-btn"
                    onClick={() => onShowMoreDetails(row.original)}
                  >
                   <IoMdEye style={{fontSize:'29px'}}/>
                  </button>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="admin-pagination">
        <button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;