
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { getSourcesResultIds } from './getsourceresultids';

interface run {
    runid: number,
    runname: string

}

interface source {
    sourceid: number,
}

export function SourceResultId({ onSourceSelect, run }: { onSourceSelect: (source: any) => void; run: run | undefined }) {

    const columns: GridColDef[] = [
        { field: 'sourceid', headerName: 'Source id', width: 150 }
    ];


    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const { sourceresultids, isLoading, isError } = getSourcesResultIds({ pageSize: paginationModel.pageSize, pageIndex: paginationModel.page, runid: run })

    


    if (isError) return <p>error</p>
    if (!sourceresultids) return <p>Loading</p>


    if (sourceresultids) {


        const elementsWithId = sourceresultids.map((element, index: number) => ({
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