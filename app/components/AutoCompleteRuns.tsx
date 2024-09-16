

import React from 'react';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { getRuns } from '@/app/components/getruns';
import { run } from '@/app/types';

export default function AutoCompleteRuns({ onRunSelect }: { onRunSelect: (run: any) => void }) {

    const { runs } = getRuns() as { runs: run[] };


    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<run>();
    const [options, setOptions] = React.useState<readonly run[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(0.01); // For demo purposes.

            if (active) {
                setOptions(runs);

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


    return (
        <div>


            <Autocomplete
                value={value}
                onChange={(event: any, newValue: run | null) => {
                    if (newValue !== null) {
                        setValue(newValue); // Set the extracted number
                        onRunSelect(newValue)
                    }
                }
                }
                size='small'
               // sx={{ width: 750 }}

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

function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}