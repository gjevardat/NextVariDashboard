

import React from 'react';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { getRuns } from '@/app/components/getruns';

export default function AutoCompleteRuns({ onRunSelect }: { onRunSelect: (run: any) => void }) {

    const { runs } = getRuns()
 
   
   
    let runnames: string[];
    if (runs) {
        runnames = runs.map((elem, index) => elem.runname)
    }
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState();
    const [options, setOptions] = React.useState<readonly string[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(0.01); // For demo purposes.

            if (active) {
                setOptions([...runnames]);

            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    //if (isLoading) return <CircularProgress/>
    //if (isError) return <p>Error</p>
   
    return (
        <div>


            <Autocomplete
                value={value}
                onChange={(event: any, newValue: string | null) => {
                    if (newValue !== null) {
                        const match = newValue.match(/_(\d+)$/); // Match number after the last underscore
                        if (match !== null) {
                            setValue(match[1]); // Set the extracted number
                            onRunSelect(match[1])
                        } else {
                            setValue(""); // Set empty if no match is found
                        }
                    } else {
                        setValue(""); // Set empty if newValue is null
                    }
                }}
                size='small'
                sx={{ width: 750 }}

                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => option}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search run..."
                        // slotProps={{
                        //     input: {
                        //         ...params.InputProps,
                        //         endAdornment: (
                        //             <React.Fragment>
                        //                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        //                 {params.InputProps.endAdornment}
                        //             </React.Fragment>
                        //         ),
                        //     },
                        // }}
                    />
                )}
            />
        </div>
    );
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }