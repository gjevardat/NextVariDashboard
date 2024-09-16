'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarContainer } from '@mui/x-data-grid';
import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';


import { run } from '@/app/types';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: any[]) => any[]) => void;
    run: run;
    setSelectedRun : ((run :run|undefined) => void);
    resetPagination: () => void;
    resetRowCount: (count: number) => void;
    setIsServerPagination: (isServerPagination: boolean) => void; // Add this prop to toggle server/client pagination
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows,run, setSelectedRun, resetPagination, resetRowCount, setIsServerPagination } = props;
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
        setIsServerPagination(false); // Switch to client-side pagination after replacing rows
        setInputValue(''); // Clear input field after replacing rows
    };

    const handleReload = () => {
        console.log("Will reload");
        setSelectedRun(run);
    };

    return (
        <GridToolbarContainer>
            <TextField
                label="sourceid1,sourceid2,..."
                value={inputValue}
                onChange={handleInputChange}
                size="small"
                style={{ marginRight: '10px', marginBottom: '10px' }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        handleReplaceRows();
                    }
                }}
            />
            <IconButton
                onClick={() => {

                    setSelectedRun(undefined);
                    setRows(() => []);
                    resetPagination();
                    resetRowCount(0);
                    setIsServerPagination(false);
                    setInputValue('')
                }
                }

                aria-label="clear"
                style={{ marginBottom: '10px' }}
            >
                <DeleteIcon />
            </IconButton>

            <IconButton
                onClick={handleReload}  // Custom function to reload data or refresh component
                aria-label="reload"
                style={{ marginBottom: '10px' }}
            >
                <RefreshIcon />
            </IconButton>
        </GridToolbarContainer>
    );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SourceResultId({ onSourceSelect, run , setSelectedRun}: { onSourceSelect: (source: any) => void; run: run | undefined , setSelectedRun : ((run :run) => void) }) {
    const pageSize = 75;

    const columns: GridColDef[] = [
        {
            field: 'sourceid',
            headerName: 'Source id',
            width: 150,
            //   flex: 1,          // Let it expand to fill available space
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

    const { data, error, isLoading } = useSWR(
         `/api/getSourceResultId?runid=${run?.runid}&offset=${paginationModel.page * paginationModel.pageSize}&size=${paginationModel.pageSize}` ,
        fetcher
    );

    useEffect(() => {
        console.log("Shoul refetch data in useEffect")
        if (data) {
            const elementsWithId = data.map((element: any) => ({
                ...element,
                id: element.sourceid, // Ensure a unique `id` field for DataGrid
            }));
            setRows(elementsWithId);
            setRowCount(run?.size || elementsWithId.length); // Set row count from server or data size
        }
    }, [data, run]);

    const resetPagination = () => {
        setPaginationModel({
            ...paginationModel,
            page: 0, // Reset to the first page
        });
    };

    const resetRowCount = (count: number) => {
        setRowCount(count); // Update row count based on the new rows added
    };

    if (error) return <div>Failed to load</div>;
    if (!data && isLoading && isServerPagination) return <div>Loading...</div>;

    return (

        <DataGrid
            onRowSelectionModelChange={(newRowSelectionModel) => {

                setRowSelectionModel(newRowSelectionModel);
                onSourceSelect(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            rows={rows}
            autoHeight
            columns={columns}
            rowCount={rowCount} // Dynamically set the row count
            loading={isLoading}
            density="compact"
            rowHeight={25}
            //pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModel}
            paginationMode={isServerPagination ? 'server' : 'client'} // Switch pagination mode
            onPaginationModelChange={(page) => {
                setPaginationModel(page);
                if (isServerPagination) {
                    onSourceSelect(undefined); // Reset selection when using server-side pagination
                }
            }}
            processRowUpdate={(newRow) => newRow}
            slots={{
                columnHeaders: () => null,
                toolbar: EditToolbar as any,
            }}
            slotProps={{
                toolbar: { setRows, run, setSelectedRun, resetPagination, resetRowCount, setIsServerPagination },
            }}



        />


    );
}
