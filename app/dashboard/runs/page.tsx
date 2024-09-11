'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useState, useEffect } from 'react'


interface runinfo {
    runid: number,
    runname: string,
    size: number,
    creationdate: Date,
    state: string

}



const columns: GridColDef[] = [
    { field: 'runid', headerName: 'Run Id', width: 150 },
    { field: 'runname', headerName: 'Run Name', width: 1000 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'creationdate', headerName: 'Date', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
];

const fetcher = (url) => fetch(url).then((res) => res.json());

function DataGridDemo() {

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 25,
        page: 0,
      });
    
      
      const { data, error, isLoading } = useSWR("/api/getRunInfo?offset="+ (paginationModel.page*25) +"&size="+paginationModel.pageSize, fetcher)
      
      if (data != null) {
          
     
        const elementsWithId: runinfo[] = data.map((element: runinfo, index: number) => ({
            ...element,
            id: element.runid 
        }));
        return (
            <DataGrid
                rows={elementsWithId}
                columns={columns}
                rowCount={200}
            	loading={isLoading}
                pageSizeOptions={[5]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
            />
        );
    }
  }

export default function Page({ params }: { params: { runId: string } }) {

    const router = useRouter()

    return (
        <div>
            <p>Your are on the run {params.runId} overview page</p>
            <DataGridDemo />
        </div>


    )
}