

import React from 'react';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { run } from '@/app/types';

export default function AutoCompleteRuns({runs, onRunSelect }: {runs:run[];  onRunSelect: (run: any) => void }) {



    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<run>();
    
    const loading = false;// open &&     options && options.length === 0;

    
 
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
                options={runs}
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