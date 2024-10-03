

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import Operators from '@/app/components/Operators'
import { run, ts, timeseriestag, source } from '@/app/types';
import { getRuns } from '@/app/components/getruns';
import { SourceGrid } from './SourceGridComponent';
import { sources } from 'next/dist/compiled/webpack/webpack';




interface BrowseTsProps {
    runid: number | null,
    sourceid: bigint | null,
    tags: string[]
}

interface page {
    pageIndex : number,
    sources: source[]
}

export default function BrowseTsComponent({ runid, sourceid, tags }: BrowseTsProps) {


    const [availableRuns, setAvailableRuns] = useState<run[]>([]);
    const [availableTags, setAvailableTags] = useState<timeseriestag[]>([]);
    const [selectedRun, setSelectedRun] = useState<run | null>(null);
    const [selectedSource, setSelectedSource] = useState<source>();
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    
    const [loadedSources, setLoadedSources] = useState<source[]>([]);
    const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 4, y: 4 })
    const [pageSize, setPageSize] = useState<number>(gridSize.x*gridSize.y);
    const [pageIndex, setPageIndex] = useState<number>(0);
    
    const prefetchPages = 10;
    const [pages, setPages] = useState<page[]>([]);
    


    async function fetchTimeSeries(run: run, tag: string[], reqPageIndex:number, pageSize:number) {

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
            
            let sources = (groupBySourceId(dataresponse));
            let currentPage = {pageIndex:reqPageIndex,sources:sources};
            setPages( (prevPages) => ([...prevPages,currentPage]))
            
        }
    }

    async function fetchRunTimeSeriesTag(run: run) {
        const response = await fetch(`/api/getTimeSeriesResultTypes?runid=${run.runid}`)
        const dataresponse = await response.json();

        setAvailableTags(dataresponse)
    }

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
        if (runid && availableRuns.length > 0) {
            setSelectedRun((prevRun) => (availableRuns.filter((run) => run.runid == runid)[0]));
        }
        if (runid && sourceid && availableRuns.length > 0) {
            setSelectedRun((prevRun) => (availableRuns.filter((run) => run.runid == runid)[0]));
            setSelectedSource({ sourceid: sourceid, timeseries: [] })
        }
    }, [availableRuns])

    useEffect(() => {
        if (selectedRun !== null) {
            fetchTimeSeries(selectedRun, selectedTags, pageIndex, pageSize);
        }
    }, [pageIndex]);


    useEffect(() => {

        if (selectedRun && pages[pageIndex])  {
            return
        }
        if( selectedRun )
            fetchTimeSeries(selectedRun, selectedTags, pageIndex, pageSize);
        
    }, [selectedRun]);

    return (

        <div className="grid-container">
            <div className="grid-item itemtop">
                <AutoCompleteRuns runs={availableRuns} selectedRun={selectedRun} onRunSelect={setSelectedRun} />
            </div>
            <div className="grid-item itemtop">
                <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
            </div>
            <div className="grid-item itemsourcebrowser">
                <SourceResultId run={selectedRun} onSourceSelect={setSelectedSource} />
            </div>
            <div className="grid-item">
               
                <SourceGrid 
                    run = {selectedRun}
                    sources={pages && pages.length>0 && pages[pageIndex] && pages[pageIndex].sources?pages[pageIndex].sources:null} 
                    columns={gridSize.x} 
                    rows={gridSize.y} pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    
                /> 
              
            </div>
        </div>
    )

   
}









