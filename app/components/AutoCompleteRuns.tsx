

import React from 'react';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { run } from '@/app/types';

export default function AutoCompleteRuns({runs, onRunSelect }: {runs:run[]|undefined; onRunSelect: (run: any) => void }) {



    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<run>();
    const [options, setOptions] = React.useState<readonly run[]|undefined>(runs);
    const loading = false;// open &&     options && options.length === 0;

    
    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);


    return (
        <div>


            <Autocomplete
          
                value={value}
                onChange={(event: any, newValue: run | null) => {
                    if (newValue ) {
                        console.log("value change in autocomplete run")
                        setValue(newValue); // Set the extracted number
                        onRunSelect(newValue)
                    }
                }
                }
                size='small'
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option: run, value: run) => option.runid === value.runid}
                getOptionLabel={(option: run) => (option.runname)}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search run..."
                    />
                )}
            />
        </div>
    );
}