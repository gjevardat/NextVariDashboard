'use client'

import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';

import useSWR from 'swr'

interface run {
    runid: number,
    runname: string

}

interface source {
    sourceid: number,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export function SourceResultId({ onSourceSelect, run }: { onSourceSelect: (source: any) => void; run: run | undefined }) {

    const columns: GridColDef[] = [
        { field: 'sourceid', headerName: 'Source id', width: 150 }
    ];

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const [sourceresultsids, setsourceids] = useState();

    const { data, error, isLoading } = useSWR(`/api/getSourceResultId?runid=${run}&offset=${(paginationModel.page * paginationModel.pageSize)}&size=${paginationModel.pageSize}`, fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>



    if (data) {
        console.log("sourceresult " + data)

        const elementsWithId = data.map((element: any, index: number) => ({
            ...element,
            id: element.sourceid
        }));

        return (

            <div>

                <DataGrid
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                        console.log(newRowSelectionModel)
                        onSourceSelect(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    rows={elementsWithId}
                    columns={columns}
                    rowCount={200}
                    loading={isLoading}
                    density='compact'
                    pageSizeOptions={[10]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={(page) => {
                        setPaginationModel(page);
                        onSourceSelect(undefined)
                    }}
                />
            </div>
        );
    }



}