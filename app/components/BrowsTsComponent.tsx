
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

    //const [gridSize, setGridSize] = usePersistentState<{ x: number, y: number }>('gridSize',{ x: 2, y: 2 });

    const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 2, y: 2 })

    const [pageIndex, setPageIndex] = useState<number>(0);

    const prefetchPages = 10;
    //const// [pages, setPages] = useState<page[]>([]);
    const [sources, setSources] = useState<source[]>([])

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


    async function fetchTimeSeriesBatch(run: run, tags: string[], pageIndexes: number[], pageSize: number) {
        try {
            // Create an array of promises for each pageIndex
            const fetchPromises = pageIndexes.map((reqPageIndex) => {
                return fetch(`/api/getTSPage?runid=${run.runid}&pageIndex=${reqPageIndex}&pageSize=${pageSize}&tags=${tags.join('&tags=')}`)
                    .then(response => response.json())
                    .then(dataresponse => ({ pageIndex: reqPageIndex, dataresponse }));
            });

            // Wait for all fetches to complete
            const results = await Promise.all(fetchPromises);
            console.log(results)
            // Now process each result to group by sourceId and update the state
            const groupedPages = results.map(({ pageIndex, dataresponse }) => {
                if (Array.isArray(dataresponse) && dataresponse.length > 0) {
                    const groupBySourceId = (array: ts[]) => {
                        return array.reduce((sources: source[], current: ts) => {
                            // Find an existing source with the same sourceid
                            let source = sources.find(s => BigInt(s.sourceid) === BigInt(current.sourceid));

                            // If not found, create a new source object
                            if (!source) {
                                source = { sourceid: BigInt(current.sourceid), timeseries: [] };
                                sources.push(source); // Add the new source to the list
                            }

                            // Add the current time series to the source's timeseries array
                            source.timeseries = [...source.timeseries, current];

                            return sources;
                        }, []);
                    };

                    const sources = groupBySourceId(dataresponse);
                    return { pageIndex, sources };
                }
                return null;
            }).filter(page => page !== null); // Remove any null pages (where dataresponse was empty)

            /*  // Now, use functional setState to update the pages state
             setPages((prevPages) => {
                 const updatedPages = [...prevPages];
     
                 // Update each page in the correct index
                 groupedPages.forEach(({ pageIndex, sources }) => {
                     updatedPages[pageIndex] = { pageIndex, sources };
                 });
     
               
 
                 return updatedPages;
             }); */

            setSources((prevSources) => {
                const flattenedSources = groupedPages.flatMap((p) => p.sources);
                const newSources = [...prevSources, ...flattenedSources];
                const sortedUniqueSources = newSources
                    .sort((a: source, b: source) => (BigInt(a.sourceid) < BigInt(b.sourceid) ? -1 : 1)) 
                    .filter((source, index, arr) => {
                        
                        return index === 0 || source.sourceid !== arr[index - 1].sourceid;
                    });
                    console.log(sortedUniqueSources);
                return sortedUniqueSources;
            });


        } catch (error) {
            console.error('Error fetching time series data:', error);
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
            fetchTimeSeriesBatch(selectedRun, selectedTags, [pageIndex], gridSize.x * gridSize.y);
        }
    }, [selectedTags]);


    useEffect(() => {
        setSources([]) // avoid strange page refresh effects. Should be better handled

        // Prevent hook on initial component mounting
        if (selectedRun) {
            //console.log(`selected Run change ${selectedRun?.runid}`)
            fetchRunTimeSeriesTag(selectedRun)
            prefetch();
        }
    }, [selectedRun]);




    useEffect(() => {
        // Prevent hook on initial component mounting
        setPageIndex(0)
    }, [gridSize]);

    async function prefetch() {
        if (selectedRun && pageIndex != null) {
            let pageSize = gridSize.x * gridSize.y;
            // Prefetch next and previous pages
            const totalPages = Math.ceil(selectedRun.size / pageSize); // Assuming total number of pages can be calculated

            let pagesToFetch: number[] = [];

        /*     // Fetch pages from previous and current indices
            for (let i = Math.max(pageIndex - prefetchPages, 0); i <= pageIndex; i++) {
                if (pages[i] == null || pages[i].sources.length != pageSize) {
                    pagesToFetch.push(i);
                }
            } */

            // Prefetch next n=prefetchPages pages (ensure it doesn't exceed total pages)
            for (let i = pageIndex ; i < Math.min(pageIndex + prefetchPages, totalPages); i++) {
                
                if (!sources[i*pageSize] &&  !sources[(i*pageSize)+pageSize-1]) {

                    pagesToFetch.push(i);
                }
            }

            // Call the batch fetching function with accumulated page indices
            if (pagesToFetch.length > 0) {
                console.log(`Will prefetch ${pagesToFetch}`)
                fetchTimeSeriesBatch(selectedRun, selectedTags, pagesToFetch, pageSize);
            }
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
                    //sources={pages && pages.length > 0 && pages[pageIndex] && pages[pageIndex].sources ? pages[pageIndex].sources : null}
                    sources={sources && sources.length > 0 ? sources.slice(pageIndex * gridSize.x * gridSize.y, (pageIndex + 1) * gridSize.x * gridSize.y) : null}
                    columns={gridSize.x}
                    rows={gridSize.y}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                />
            </div>
        </div>
    )
}


