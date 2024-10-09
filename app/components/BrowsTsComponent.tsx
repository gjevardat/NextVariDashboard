'use client'

import React, { useCallback, useReducer, useRef } from 'react';
import { useState, useEffect } from 'react'
import { run, ts, timeseriestag, source } from '@/app/types';

import { SourceGrid } from './SourceGridComponent';
import Pagination from './PaginationComponent';
import SourceSelectionComponent from './SourceSelectionComponent';
import { dataselection } from './StateReducer';



interface BrowseTsProps {
    run: run | null,
    sourceid: bigint | null,
    tags: string[],
    availableRuns: run[]

}

export interface page {
    pageIndex: number,
    sources: source[]
}


export default function BrowseTsComponent({ run, sourceid, tags, availableRuns }: BrowseTsProps) {

    const [loading, setLoading] = useState<boolean>(false)
    const [availableTags, setAvailableTags] = useState<timeseriestag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);

    const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 2, y: 2 })
    const [pageIndex, setPageIndex] = useState<number>(0);
    const defaultPrefetchPages = 10;
    const [sources, setSources] = useState<source[]>([])


    const [dataSelection, setDataSelection] = useState<dataselection>({ selectedRun: null, selectedSources: [] });

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
        [dataSelection, gridSize, pageIndex] // Add state variables as dependencies 
    );

       //todo in SQL ?
    function groupBySourceId(array: ts[]): source[] {
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
    }

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
            // console.log(results)
            // Now process each result to group by sourceId and update the state
            const groupedPages = results.map(({ pageIndex, dataresponse }) => {
                if (Array.isArray(dataresponse) && dataresponse.length > 0) {
                    const sources = groupBySourceId(dataresponse);
                    return { pageIndex, sources };
                }
                return null;
            }).filter(page => page !== null); // Remove any null pages (where dataresponse was empty)

            setSources((prevSources) => {
                const flattenedSources = groupedPages.flatMap((p) => p.sources);
                const newSources = [...prevSources, ...flattenedSources];
                const sortedUniqueSources = newSources
                    .sort((a: source, b: source) => (BigInt(a.sourceid) < BigInt(b.sourceid) ? -1 : 1))
                    .filter((source, index, arr) => {

                        return index === 0 || source.sourceid !== arr[index - 1].sourceid;
                    });

                return sortedUniqueSources;
            });


        } catch (error) {
            
            console.error('Error fetching time series data:', error);
        }
        finally{
            setLoading(false)
        }
    }

    async function fetchTimeSeriesList(run: run, tags: string[], sourceids: bigint[]) {
        setLoading(true)
        if (sourceids && sourceids.length > 0) {

            const sourceidsString = sourceids.map((id) => id.toString()).join('&sourceids=');

            const dataPromise: Promise<any> = fetch(`/api/getTS?runid=${run.runid}&tags=${tags.join('&tags=')}&sourceids=${sourceidsString}`)
                .then(response => response.json());

            const results = await dataPromise;
            const sources = groupBySourceId(results);
            setSources((prevSources) => {

                const newSources = [...prevSources, ...sources];
                const sortedUniqueSources = newSources
                    .sort((a: source, b: source) => (BigInt(a.sourceid) < BigInt(b.sourceid) ? -1 : 1))
                    .filter((source, index, arr) => {

                        return index === 0 || source.sourceid !== arr[index - 1].sourceid;
                    });
                //console.log(sortedUniqueSources);
                return sortedUniqueSources;
            });

        }
        setLoading(false)
    }


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
        //trigger some prefetch when we change page except for first page
        
        if (pageIndex != 0)
            dataSelection.selectedRun && prefetch(dataSelection, sources, pageIndex, 10);
    }, [pageIndex]);

    useEffect(() => {
        const selectedRun = dataSelection && dataSelection.selectedRun
        if (selectedRun) {
            setSources((prevSources) => []) // empty the sources when changing tags to force refetching           
            fetchTimeSeriesBatch(selectedRun, selectedTags, [pageIndex], gridSize.x * gridSize.y);
        }
    }, [selectedTags]);


    useEffect(() => {
        // Prevent hook on initial component mounting
        const selectedRun = dataSelection && dataSelection.selectedRun
        if (selectedRun) {
           
            fetchRunTimeSeriesTag(selectedRun);
            setSources((prevSources) => []) // empty the sources when changing run           
            setPageIndex(0)
            prefetch(dataSelection, [], 0, 4);
            if (dataSelection.selectedSources.length > 0) {
                const idsToFetch = dataSelection.selectedSources.filter((id) => sources.length>0?id:!sources.map(s => (s.sourceid)).includes(id));
                console.log("ids to fetch", idsToFetch)
                fetchTimeSeriesList(selectedRun, selectedTags, idsToFetch)
            }
            
        }
    }, [dataSelection.selectedRun]);

    useEffect(() => {
        // Prevent hook on initial component mounting
        const selectedRun = dataSelection && dataSelection.selectedRun

        if (selectedRun) {
            console.log(`data selection change for run  ${selectedRun?.runid} and sources ${dataSelection.selectedSources}`)
            if (dataSelection.selectedSources.length > 0) {
                const idsToFetch = dataSelection.selectedSources.filter((id) => !sources.map(s => (s.sourceid)).includes(id));
                console.log("ids to fetch", idsToFetch)
                fetchTimeSeriesList(selectedRun, selectedTags, idsToFetch)
            }
            setPageIndex(0)
        }
    }, [dataSelection.selectedSources]);

    useEffect(() => {
        dataSelection.selectedRun && setPageIndex(0)
        dataSelection.selectedRun && prefetch(dataSelection, sources, pageIndex, 2);
    }, [gridSize]);

    async function prefetch(dataselection: dataselection, currentSources: source[], page: number, prefetchPages: number = defaultPrefetchPages) {
        if (dataselection.selectedRun && page != null) {
            console.log("starting fetch data")
            let pagesToFetch: number[] = [];
            let pageSize = gridSize.x * gridSize.y;
            let totalPages = Math.ceil(dataselection.selectedRun.size / pageSize); // Assuming total number of pages can be calculated


            // Prefetch next n=prefetchPages pages 
            for (let i = page; i < Math.min(page + prefetchPages, totalPages); i++) {
                if (!currentSources[i * pageSize] && !currentSources[(i * pageSize) + pageSize - 1]) {
                    pagesToFetch.push(i);
                }
            }

            // Call the batch fetching function with accumulated page indices
            if (pagesToFetch.length > 0) {
                //console.log(`Will prefetch ${pagesToFetch}`)
                fetchTimeSeriesBatch(dataselection.selectedRun, selectedTags, pagesToFetch, pageSize);
            }
        }
    }
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
                <SourceGrid
                    run={dataSelection.selectedRun}
                    sources={
                        sources
                            .filter((source) => { return dataSelection.selectedSources.length > 0 ? dataSelection.selectedSources.includes(BigInt(source.sourceid)) : true })
                            .slice(pageIndex * gridSize.x * gridSize.y, (pageIndex + 1) * gridSize.x * gridSize.y) }
                    columns={gridSize.x}
                    rows={gridSize.y}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    isLoading={loading}
                />
            </div>
            <div className="grid-footer">
                <Pagination
                    currentPageIndex={pageIndex}
                    totalItems={dataSelection.selectedRun ? dataSelection.selectedSources.length > 0 ? dataSelection.selectedSources.length : dataSelection.selectedRun.size : 0}
                    itemsPerPage={gridSize.x * gridSize.y}
                    onPageChange={setPageIndex}
                />
            </div>

        </div>
    )
}


