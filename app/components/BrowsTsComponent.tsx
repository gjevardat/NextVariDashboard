
'use client'

import React, { useCallback } from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import Operators from '@/app/components/Operators'
import { run, ts, timeseriestag, source } from '@/app/types';
import { getRuns } from '@/app/components/getruns';
import { SourceGrid } from './SourceGridComponent';
import GridSizeSelector from './GridSelector';
import { TextField } from '@mui/material';
import usePersistentState from './UsePersistentState'


interface BrowseTsProps {
    runid: number | null,
    sourceid: bigint | null,
    tags: string[]
}

interface page {
    pageIndex: number,
    sources: source[]
}

export default function BrowseTsComponent({ runid, sourceid, tags }: BrowseTsProps) {


    const [availableRuns, setAvailableRuns] = useState<run[]>([]);
    const [availableTags, setAvailableTags] = useState<timeseriestag[]>([]);
    const [selectedRun, setSelectedRun] = useState<run | null>(null);

    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [inputValue, setInputValue] = React.useState('');

    const [gridSize, setGridSize] = usePersistentState<{ x: number, y: number }>('gridSize',{ x: 2, y: 2 });

    //const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 2, y: 2 })
    
    const [pageIndex, setPageIndex] = useState<number>(0);

    const   prefetchPages= 2;
    const [pages, setPages] = useState<page[]>([]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (selectedRun) {
                if (event.key === 'PageDown') {
                    const totalPages = Math.ceil(selectedRun.size / (gridSize.x * gridSize.y));
                    setPageIndex((prevPageIndex) => (prevPageIndex < (totalPages - 1) ? prevPageIndex + 1 : prevPageIndex));
                } else if (event.key === 'PageUp') {
                    setPageIndex((prevPageIndex) => (prevPageIndex > 0 ? prevPageIndex - 1 : 0));
                }
            }
        },
        [selectedRun, gridSize, pageIndex] // Add state variables as dependencies 
    );


    async function fetchTimeSeries(run: run, tag: string[], reqPageIndex: number, pageSize: number) {

        const response = await fetch(`/api/getTSPage?runid=${run.runid}&pageIndex=${reqPageIndex}&pageSize=${pageSize}&tags=${selectedTags.join('&tags=')}`);
        const dataresponse = await response.json();


        if (Array.isArray(dataresponse) && dataresponse.length > 0) {

            const groupBySourceId = (array: ts[]) => {
                return array.reduce((sources: source[], current: ts, index: number) => {

                    // Find an existing source with the same sourceid
                    let source = sources.find(s => s.sourceid === current.sourceid);

                    // If not found, create a new source object
                    if (!source) {
                        source = { sourceid: current.sourceid, timeseries: [] };
                        sources.push(source); // Add the new source to the list
                    }

                    // Add the current time series to the source's timeseries array
                    source.timeseries = [...source.timeseries, current];

                    return sources;
                }, []);
            };

            const sources = (groupBySourceId(dataresponse));
            const currentPage = { pageIndex: reqPageIndex, sources: sources };
            // console.log(`loaded page ${reqPageIndex}`)
            // important to use function form of setPages to ensure we work on latest snapshot of the state pages
            setPages((prevPages) => {
                // Create a copy of the previous pages array
                const updatedPages = [...prevPages];

                // Set the current page at the required index
                updatedPages[reqPageIndex] = currentPage;

                // Return the updated pages array
                return updatedPages;
            });
        }
    }

    async function fetchRunTimeSeriesTag(run: run) {
        const response = await fetch(`/api/getTimeSeriesResultTypes?runid=${run.runid}`)
        const dataresponse = await response.json();

        setAvailableTags(dataresponse)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        const ids = inputValue.split(/\s+|,|;/).map((id) => id.trim()).filter((id) => id);

    };

    useEffect(() => {
        if (selectedRun) {
            //   console.log(`pages size is now ${pages.length}`);
        }
    }, [pages]); // This will trigger whenever pages updates

    useEffect(() => {


        
        // attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        // remove the event listener when the component unmounts or dependencies change
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Add handleKeyDown as a dependency

    useEffect(() => {
        async function fetchRuns() {
            try {
                const runs = await getRuns(); // Fetch runs data
                setAvailableRuns(runs); // Update state with the fetched data
            } catch (error) {
                console.error("Failed to fetch runs:", error);
            }
        }

        fetchRuns();


    }, []); // Empty dependency array means it runs once when the component mounts

    // set selected run or selected run + selected sources if present in URL

    useEffect(() => {
        if (runid !== null && availableRuns.length > 0) {
            setSelectedRun((prevRun) => (availableRuns.filter((run) => run.runid == runid)[0]));
        }

    }, [availableRuns])

    useEffect(() => {
        prefetch();
    }, [pageIndex]);

    useEffect(() => {
        if (selectedRun !== null) {
            fetchTimeSeries(selectedRun, selectedTags, pageIndex, gridSize.x*gridSize.y);
        }
    }, [selectedTags]);


    useEffect(() => {
        // Prevent hook on initial component mounting
        if (selectedRun) {
            //console.log(`selected Run change ${selectedRun?.runid}`)
            fetchRunTimeSeriesTag(selectedRun)
            prefetch();
        }
    }, [selectedRun]);




    useEffect(() => {
        // Prevent hook on initial component mounting

        setPages([]) // avoid strange page refresh effects. Should be better handled
        
        setPageIndex(0)
        prefetch();
    }, [gridSize]);

    async function prefetch() {
        if (selectedRun && pageIndex != null) {
            let pageSize = gridSize.x*gridSize.y;
            // Prefetch next and previous pages
            const totalPages = Math.ceil(selectedRun.size / pageSize); // Assuming total number of pages can be calculated

            // Prefetch previous 10 pages (ensure no negative index)
            for (let i = Math.max(pageIndex - prefetchPages, 0); i <= pageIndex; i++) {
                if (pages[i] == null || pages[i].sources.length != pageSize) {
                    fetchTimeSeries(selectedRun, selectedTags, i, pageSize);
                }
            }

            // Prefetch next 10 pages (ensure it doesn't exceed total pages)
            for (let i = pageIndex + 1; i <= Math.min(pageIndex + prefetchPages, totalPages - 1); i++) {
                if (pages[i] == null || pages[i].sources.length != pageSize) {
                    fetchTimeSeries(selectedRun, selectedTags, i, pageSize);
                }
            }

            // Handle the current page: use cached / prefetched pages
            /*  if (pages[pageIndex] != null && pages[pageIndex].sources.length === pageSize) {
                 return;
             } else {
                 fetchTimeSeries(selectedRun, selectedTags, pageIndex, pageSize);
             } */
        }
    }
    return (

        <div className="grid-container">
            <div className="grid-header">
                <AutoCompleteRuns runs={availableRuns} selectedRun={selectedRun} onRunSelect={setSelectedRun} />
                <div>
                    <TextField
                        label="sourceids"
                        value={inputValue}
                        onChange={handleInputChange}
                        size="small"

                    />
                </div>
                <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
                <GridSizeSelector gridSize={gridSize} setGridSize={setGridSize} />
            </div>

            <div className="grid-content">

                <SourceGrid
                    run={selectedRun}
                    sources={pages && pages.length > 0 && pages[pageIndex] && pages[pageIndex].sources ? pages[pageIndex].sources : null}
                    columns={gridSize.x}
                    rows={gridSize.y}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            </div>
        </div>
    )
}


