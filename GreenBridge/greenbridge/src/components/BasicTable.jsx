import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({ rows, columns }) {
  return (
    <div style={{ height: '45vh', width: '100%', marginTop: '20px' ,background: '#87CEEB'}}> {/* Adjust height and width */}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #ffff',  // Softer border for a cleaner look
          },
          '& .MuiDataGrid-cell': {
            padding: '10px',
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
