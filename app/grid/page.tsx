'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridRowsProp, GridRowModesModel, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';

const initialRows: GridRowsProp = [
  { id: 1, sourceid: 132132132 },
  { id: 2, sourceid: 32132132355 }
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows } = props;
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddRows = () => {
    const ids = inputValue.split(',').map((id) => id.trim()).filter((id) => id);
    setRows((oldRows) => ids.map((id, index) => ({
        id: index,
        sourceid: Number(id),
      })),
    );
    setInputValue(''); // Clear input field after adding rows
  };

  return (
    <GridToolbarContainer>
      <TextField
        label="sourceid1,sourceid2,..."
        value={inputValue}
        onChange={handleInputChange}
        
        variant="outlined"
        size="small"
        style={{ marginRight: '10px' }}
        onKeyDown={(ev) => {            
            if (ev.key === 'Enter') {
              handleAddRows();
            }
          }}
      />
      
    </GridToolbarContainer>
  );
}

export default function SourceBrowseGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const columns: GridColDef[] = [
    { field: 'sourceid', headerName: 'Source ID', width: 180, editable: false },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        processRowUpdate={(newRow) => newRow}
        slots={{
          columnHeaders: () => null,
          toolbar: EditToolbar as any,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        
      />
    </Box>
  );
}
