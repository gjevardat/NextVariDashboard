

import React from 'react';
import { Chip, CircularProgress, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { run } from '@/app/types';
import { styled } from "@mui/material/styles";

export default function AutoCompleteRuns({runs, selectedRun, onRunSelect }: {runs:run[];  selectedRun:run| null, onRunSelect: (run: any) => void }) {



   // const [open, setOpen] = React.useState(false);
    //const [value, setValue] = React.useState<run>(selectedRun);
    
    const loading = false;// open &&     options && options.length === 0;

    const CustomListbox = styled('ul')({
        fontSize: '12px', // Customize the font size here
      });
      
 
    return (
        <div>


            <Autocomplete
                
                value={selectedRun|| null}
                onChange={(event: any, newValue: run | null) => {
                    if (newValue ) {
                        console.log("value change in autocomplete run")
                       // setValue(newValue); // Set the extracted number
                        onRunSelect(newValue)
                    }
                }
                }
                size='small'
              /*   open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }} */
                ListboxComponent={CustomListbox}

                isOptionEqualToValue={(option: run, value: run) => option.runid === value.runid}
                getOptionLabel={(option: run) => (option.runname)}
                options={runs}
               // loading={loading}
                renderInput={(params) => (
                    <TextField
                    {...params}
                   label="Search run"
                   sx={{
                    '& .MuiInputBase-root': { 
                      fontSize: '12px',
                      
                    },
                    
                  }} 
                    />
                )}
               
            />
        </div>
    );
}