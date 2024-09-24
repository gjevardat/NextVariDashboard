import React, { useEffect, useState } from 'react';

import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarContainer } from '@mui/x-data-grid';
import { IconButton, Input, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';


import { run, source } from '@/app/types';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: any[]) => any[]) => void;
    
    resetPagination: () => void;
    resetRowCount: (count: number) => void;
    setIsServerPagination: (isServerPagination: boolean) => void; // Add this prop to toggle server/client pagination
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows,  resetPagination, resetRowCount, setIsServerPagination } = props;
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleReplaceRows = () => {
        const ids = inputValue.split(',').map((id) => id.trim()).filter((id) => id);
        const newRows = ids.map((id, index) => ({
            id: Number(id),
            sourceid: Number(id),
        }));
        
        setRows(() => newRows); // Replace the old rows with the new rows
        resetPagination(); // Reset pagination to show new rows from the first page
        resetRowCount(newRows.length); // Update the row count
        setIsServerPagination(true); // Switch to client-side pagination after replacing rows
        setInputValue(''); // Clear input field after replacing rows
    };


    return (
        <GridToolbarContainer>
            <TextField
                label="sourceid1,sourceid2,..."
                value={inputValue}
                onChange={handleInputChange}
                size="small"
                style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        handleReplaceRows();
                    }
                }}
            />          
        </GridToolbarContainer>
    );
}




export function SourceResultId({ run , onSourceSelect}: {  run: run|null; onSourceSelect: (source: source) => void  }) {
    const pageSize = 100;
    
    const columns: GridColDef[] = [
        {
            field: 'sourceid',
            headerName: 'Source id',
            flex: 1,//      expand to fill available space
           // renderHeader: () => <HeaderWithInput label=" sourceid1, sourceid2, ..." />
        }
    ];

    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [rows, setRows] = useState<any[]>([]);

    const [rowCount, setRowCount] = useState<number>(run?.size || 0); // Manage row count state
    const [isServerPagination, setIsServerPagination] = useState(true); // Add a state to toggle between server and client pagination

    
   

    async function fetchSourceResultIds(run: run) {

        const response = await fetch( `/api/getSourceResultId?runid=${run?.runid}&offset=${paginationModel.page * paginationModel.pageSize}&size=${paginationModel.pageSize}`);
        const data : source[]= await response.json();

        if (data && data.length>0) {
            const elementsWithId = data.map((element: any) => ({
                ...element,
                id: element.sourceid, // Ensure a unique `id` field for DataGrid
            }));
            setRows(elementsWithId);
            setRowCount(run?.size || elementsWithId.length); // Set row count from server or data size
        }   
    }


    useEffect(() => { 
        if(run != undefined)
            fetchSourceResultIds(run);
    }, [run]);

    const resetPagination = () => {
        setPaginationModel({
            ...paginationModel,
            page: 0, // Reset to the first page
        });
    };

    const resetRowCount = (count: number) => {
        setRowCount(count); // Update row count based on the new rows added
    };

    

    return (

        <DataGrid
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
                console.log("selected row : ",newRowSelectionModel[0])
                if(newRowSelectionModel[0]!=undefined){
                    onSourceSelect({sourceid:BigInt(newRowSelectionModel[0])});
                }
            }}
            
            rowSelectionModel={rowSelectionModel}
            rows={rows}
            
            columns={columns}
            rowCount={rowCount} // Dynamically set the row count
            
            density="compact"
            rowHeight={25}
            
            paginationModel={paginationModel}
            paginationMode={isServerPagination ? 'server' : 'client'} // Switch pagination mode
            onPaginationModelChange={(page) => {
                setPaginationModel(page);
                if (isServerPagination) {
                    onSourceSelect(undefined); // Should take first row
                }
            }}
            pageSizeOptions={[]}
            processRowUpdate={(newRow) => newRow}
            slots={{
               //columnHeaders: () => <HeaderWithInput label="sourceid1, sourceid2, ..." />
                toolbar: EditToolbar as any,
            }}
            slotProps={{
                toolbar: { setRows,  resetPagination, resetRowCount, setIsServerPagination },
            }}
            hideFooterPagination={false}
            hideFooterSelectedRowCount={true}
            sx={{
                '.MuiDataGrid-columnSeparator': {
                    display: 'none',
                },
                //'.MuiDataGrid-selectedRowCount':{display: 'none'},
                
            }}

        />
    );
}

