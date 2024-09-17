'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { run, ts } from '@/app/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function Page() {
    const [selectedRun, setSelectedRun] = useState<run | undefined>();
    const [selectedSource, setSelectedSource] = useState<number>();
    const [selectedTags, setSelectedTags] = useState<string[]>(['ExtremeErrorCleaningMagnitudeDependent_FOV_G', 'ExtremeErrorCleaningMagnitudeDependent_FOV_BP',
        'ExtremeErrorCleaningMagnitudeDependent_FOV_RP'
    ]);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);



    async function fetchData(run: run, source: number, tag: string) {

        const response = await fetch(`/api/getTS?runid=${run.runid}&sourceId=${source}&tags=${tag}`);
        const dataresponse = await response.json();

        console.log("response ", dataresponse);
        if (Array.isArray(dataresponse) && dataresponse.length > 0) {
            console.log("data response from ts loading: ", dataresponse[0].sourceid);

            // Directly update the loadedTs state with fetche   d data
            setLoadedTs((prevLoadedTs) => [
                ...prevLoadedTs,
                {
                    tag: tag,
                    sourceid: dataresponse[0].sourceid,
                    obstimes: dataresponse[0].obstimes,
                    vals: dataresponse[0].val,
                    errs: dataresponse[0].valerr,
                },
            ]);
        }
    }

    useEffect(() => {

        console.log("tag  or run change, reloading ")

        if (!Array.isArray(selectedTags)) {
            console.error("selectedTags is not an array, curious it was initialized");
            console.log(selectedTags)
            return;
        }

        // Check if loadedTs is an array
        if (!Array.isArray(loadedTs)) {
            console.error("loadedTs is not an array");
            return;
        }

        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {
            // Find tags that are in selectedTags but not in loadedTs
            const tagsToLoad = selectedTags.filter(
                (tag) => !loadedTs.some(
                    (loadedItem) => (loadedItem.tag === tag && loadedItem.sourceid === selectedSource))
            );

            if (tagsToLoad.length === 0) {
                console.log("Nothing new tag to load, quit load ...")
                return; // No new tags to load
            }




            // Fetch data for each tag that needs to be loaded
            tagsToLoad.forEach((tag) => {
                console.log("Ts to fetch " + selectedSource + ":" + tag + " for run " + selectedRun)
                fetchData(selectedRun, selectedSource, tag);
            });
        }
    }, [selectedTags, selectedRun]); // Dependency array

    useEffect(() => {

        console.log("source  change, reloading with selected tags" + selectedSource + " selected")

        setLoadedTs((previousTs) => { return [] });
        if (!Array.isArray(selectedTags)) {
            console.error("selectedTags is not an array, curious it was initialized");
            console.log(selectedTags)
            return;
        }

        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {
            if (selectedTags.length === 0) {
                console.log("Nothing new tag to load, quit load ...")
                return; // No new tags to load
            }

            // Fetch data for each tag that needs to be loaded
            selectedTags.forEach((tag) => {
                console.log("Ts to fetch " + selectedSource + ":" + tag + " for run " + selectedRun)
                fetchData(selectedRun, selectedSource, tag);
            });
        }
    }, [selectedSource]); // Dependency array

    return (

        <div className="grid-container">
        <div className="grid-item itemtop"> <AutoCompleteRuns onRunSelect={setSelectedRun} /></div>
        <div className="grid-item itemtop"> <Operators run={selectedRun} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
        </div>
        <div className="grid-item item3">                    {selectedRun && <SourceResultId onSourceSelect={setSelectedSource} run={selectedRun} setSelectedRun={setSelectedRun} />}
        </div>
        <div className="grid-item item4">{selectedSource && Number(selectedSource) !== 0 && selectedTags && selectedTags.length > 0 && loadedTs && loadedTs.length > 0 && (
                        <TimeSeries sourceId={Number(selectedSource)} tsArray={loadedTs} />
                    )}</div>
      </div>
      /*   <Grid container  spacing={1}  display="flex" >
            
            
                <Grid size={4}  >
                    <AutoCompleteRuns onRunSelect={setSelectedRun} />
                </Grid>
                <Grid size={8}  >
                    <Operators run={selectedRun} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
                </Grid>
            


            
                <Grid size={4}   >
                    {selectedRun && <SourceResultId onSourceSelect={setSelectedSource} run={selectedRun} setSelectedRun={setSelectedRun} />}
                </Grid>
                <Grid size={8}  >
                    {selectedSource && Number(selectedSource) !== 0 && selectedTags && selectedTags.length > 0 && loadedTs && loadedTs.length > 0 && (
                        <TimeSeries sourceId={Number(selectedSource)} tsArray={loadedTs} />
                    )}
                </Grid>
            
        </Grid> */






    )
}









