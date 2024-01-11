import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";

interface dataTableProps {
  rows: any[];
  columnDefs: ColDef[];
}

const DataTable = ({ rows, columnDefs }: dataTableProps) => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      flex: 1,
    };
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={40}
        gridOptions={{
          pagination: true,
          paginationPageSize: 10,
          paginationPageSizeSelector: [10, 20, 100],
        }}
        // onRowClicked={(params) => {
        //   console.log("Row clicked:", params.data);
        // }}
      />
    </div>
  );
};

export default DataTable;
