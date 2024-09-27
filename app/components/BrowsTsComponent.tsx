

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
import { run, ts, timeseriestag, source } from '@/app/types';
import { getRuns } from '@/app/components/getruns';

import useEmblaCarousel from 'embla-carousel-react';
import EmblaCarousel from './EmblaCarousel';



interface BrowseTsProps {
    runid: number | null,
    sourceid: bigint | null,
    tags: string[]
}

interface GridProps{
    sources: source[]|null,
    columns: number,
    rows:number
}


const OPTIONS = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())


const SourceGrid: React.FC<GridProps > = ({ sources, columns, rows }) => {
    return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`, // Fixed columns
            gridTemplateRows: `repeat(${rows}, 1fr)`,       // Fixed rows
            gap: '10px', // Space between grid items
            height: '100%', // Ensure grid does not expand indefinitely
            overflow: 'hidden', // Prevent overflow issues
          }}
        >
          { sources && Array.from({ length: sources.length }, (_, index) => {
            const source = sources[index];
    
            // If no source exists at this index, return an empty cell
            if (!source) {
              return <div key={index} style={{ border: '1px solid #ccc' }} />;
            }
    
            // Render the source component
            return (
              <div
                key={source.sourceid}
                style={{
                  border: '1px solid #ccc', // Example styling, adjust as needed
                  padding: '10px',
                  height: '100%',
                  overflow: 'hidden'
                }}
              >
                <h4><b>{source.sourceid}</b></h4>
                <TimeSeries source={sources?source:null} />
              </div>
            );
          })}
        </div>
      );
    };

export default function BrowseTsComponent({ runid, sourceid, tags }: BrowseTsProps) {


    const [availableRuns, setAvailableRuns] = useState<run[]>([]);
    const [availableTags, setAvailableTags] = useState<timeseriestag[]>([]);
    const [selectedRun, setSelectedRun] = useState<run | null>(null);
    const [selectedSource, setSelectedSource] = useState<source>();
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);
    const [loadedSources, setLoadedSources] = useState<source[]>([]);
    const [gridSize, setGridSize] = useState<{ x: number, y: number }>({ x: 1, y: 1 })
    const [pageSize, setPageSize] = useState<number>(4);
    const [pageIndex, setPageIndex] = useState<number>(0);
    


    async function fetchTimeSeries(run: run, tag: string[], pageIndex:number, pageSize:number) {

        const response = await fetch(`/api/getTSPage?runid=${run.runid}&pageIndex=${pageIndex}&pageSize=${pageSize}&tags=${selectedTags.join('&tags=')}`);
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


            setLoadedTs(dataresponse);
            setLoadedSources(groupBySourceId(dataresponse));
            console.log(groupBySourceId(dataresponse));
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

    //load the ts when a run/source or tag is changed
    useEffect(() => {

        setLoadedTs((prevTs) => { return [] });
        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {

            const tagsToLoad = selectedTags

            if (tagsToLoad.length === 0) {
                return; // No new tags to load
            }


            fetchTimeSeries(selectedRun, selectedTags, pageIndex, pageSize);

        }
    }, [selectedTags, selectedRun, pageIndex]); // Any change in one of these states will trigger the useEffect function

    useEffect(() => {
        if (selectedRun !== null) {

            fetchRunTimeSeriesTag(selectedRun);
        }
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
                {/* <TimeSeries sourceid={selectedSource ? selectedSource.sourceid : null} tsArray={loadedTs} /> */}
                {/* <div>
                <TimeSeries source={loadedSources&&loadedSources.length>0?loadedSources[0]:null} />
                    
                </div>
                <div>


                <TimeSeries source={loadedSources&&loadedSources.length>0?loadedSources[1]:null} />
                </div> */}
               {/*  <SourceGrid sources={loadedSources&&loadedSources.length>0?loadedSources:null} columns={2} rows={2}/> */}
               {selectedRun &&  
               <EmblaCarousel 
                    slides={Array.from(Array(10).keys())} 
                    options={OPTIONS} 
                    children={<SourceGrid sources={loadedSources&&loadedSources.length>0?loadedSources:null} columns={2} rows={2}/>}
                    setPageIndex={setPageIndex}/>  
               }
            </div>
        </div>
    )

   
}









