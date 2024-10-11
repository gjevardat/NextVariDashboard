'use client'

import React, { useCallback, useReducer, useRef } from 'react';
import { useState, useEffect } from 'react'
import { run, ts, timeseriestag, source } from '@/app/types';
import { SourceGrid } from './SourceGridComponent';
import Pagination from './PaginationComponent';
import SourceSelectionComponent, { dataselection } from './SourceSelectionComponent';
interface BrowseTsProps {
    db: string;
    run: run | null ,
    sourceid: bigint | null,
    tags: string[],
    availableRuns: run[]

}

export default function BrowseTsComponent({ db, run, sourceid, tags, availableRuns }: BrowseTsProps) {

    const [availableTags, setAvailableTags] = useState<timeseriestag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 2, y: 2 })
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [dataSelection, setDataSelection] = useState<dataselection>({ selectedRun:run, selectedSources: [] });    
    const selectedRun = dataSelection && dataSelection.selectedRun

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const selectedRun = dataSelection && dataSelection.selectedRun
            if (selectedRun) {
                if (event.key === 'PageDown') {
                    const totalPages = Math.ceil(selectedRun.size / (gridSize.x * gridSize.y));
                    setPageIndex((prevPageIndex) => (prevPageIndex < (totalPages - 1) ? prevPageIndex + 1 : prevPageIndex));
                } else if (event.key === 'PageUp') {
                    setPageIndex((prevPageIndex) => (prevPageIndex > 0 ? prevPageIndex - 1 : 0));
                }
            }
        },
        [dataSelection, gridSize, pageIndex] // not sure why one's need to recreate handler each key stroke ?
    );

    async function fetchRunTimeSeriesTag(run: run) {
        const response = await fetch(`/api/getTimeSeriesResultTypes?runid=${run.runid}`)
        const dataresponse = await response.json();
        setAvailableTags(dataresponse)
    }

    /**
     * Update run state coming from prop when component is mounting
     */
    useEffect(() => {
        sourceid && setGridSize({x:1,y:1});
        setDataSelection({selectedRun: run ,selectedSources:sourceid?Array(sourceid):[]});
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        // remove the event listener when the component unmounts or dependencies change
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Add handleKeyDown as a dependency

    useEffect(() => {
        if (selectedRun) {
           fetchRunTimeSeriesTag(selectedRun)
        }
    }, [dataSelection.selectedRun]);

    useEffect(() => {
        if (selectedRun) {
            console.log(`data selection change for run  ${selectedRun?.runid} and sources ${dataSelection.selectedSources}`)
            setPageIndex(0)
        }
    }, [dataSelection.selectedSources]);

    useEffect(() => {
        dataSelection.selectedRun && setPageIndex(0)
    }, [gridSize]);

  
    return (

        <div className="grid-container">
            <div className="grid-header">
                <SourceSelectionComponent
                    availableRuns={availableRuns}
                    dataSelection={dataSelection}
                    setDataSelection={setDataSelection}
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                />
            </div>

            <div className="grid-content">
                 {selectedRun!==null && <SourceGrid
                    dataselection={dataSelection}
                    run={selectedRun}
                  
                    selectedTags={selectedTags}
                    columns={gridSize.x}
                    rows={gridSize.y}
                    pageIndex={pageIndex}
                    
                    
                />}
            </div>
            <div className="grid-footer">
                {selectedRun && <Pagination
                    currentPageIndex={pageIndex}
                    totalItems={dataSelection.selectedRun ? dataSelection.selectedSources.length > 0 ? dataSelection.selectedSources.length : dataSelection.selectedRun.size : 0}
                    itemsPerPage={gridSize.x * gridSize.y}
                    onPageChange={setPageIndex}
                />}
            </div>

        </div>
    )
}

