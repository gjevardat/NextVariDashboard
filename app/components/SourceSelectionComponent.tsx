import React, { useRef, useState } from 'react';
import {
    TextField,
    Box,
    Badge,
} from '@mui/material';

import AutoCompleteRuns from '@/app/components//AutoCompleteRuns'; // Your existing component
import Operators from '@/app/components/Operators'; // Your existing component
import GridSizeSelector from '@/app/components/GridSelector'; // Your existing component
import { run, timeseriestag } from '../types';
import { dataselection } from './StateReducer';



interface SourceSelectionProps {
    availableRuns: run[],
    dataSelection: dataselection,
    setDataSelection: React.Dispatch<React.SetStateAction<dataselection>>,
    availableTags:timeseriestag[],
    selectedTags:string[]
    setSelectedTags:React.Dispatch<React.SetStateAction<string[]>>,
    gridSize:{ x: number, y: number }
    setGridSize:React.Dispatch<React.SetStateAction<{ x: number, y: number }>>,
}
const SourceSelectionComponent = ({
    availableRuns,
    dataSelection,
    setDataSelection,
    
    availableTags,
    selectedTags,
    setSelectedTags,
    gridSize,
    setGridSize,
}: SourceSelectionProps) => {


    const [inputValue, setInputValue] = React.useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    
    const sourceIdsCount = inputValue.split(/\s+|,|;/).filter((id) => id.trim()).length;

    const handleValidateSourceSelection = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            
            const ids: bigint[] = inputValue.split(/\s+|,|;/).map((id) => id.trim()).filter((id) => id).map((id) => BigInt(id)); 
            inputRef && inputRef.current && inputRef.current.blur();
            console.log("selected soruces",ids);
            setDataSelection((prevSelection:dataselection) => ({ ...prevSelection, selectedSources: ids }));
           
        }

    };
    return (
        <div>
            {/* Filter Button */}
            <Box
                bgcolor="#f9f9f9"
                borderRadius="8px"
                boxShadow={2}
                padding="4px"
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>


                {/* Summary Information as Badges */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Selected Run Chip - Clickable */}
                    {dataSelection.selectedRun && (


                        <AutoCompleteRuns
                            runs={availableRuns}
                            selectedRun={dataSelection.selectedRun}
                            onRunSelect={(newRun) => {
                                setDataSelection({ ...dataSelection, selectedRun: newRun });

                            }}
                        />

                    )}
                    <Badge badgeContent={sourceIdsCount} max={Infinity} color="primary" anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}>
                        <TextField
                            label="sourceids"
                            inputRef={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)} // Handle input value change
                            onKeyDown={handleValidateSourceSelection} // Handle logic on Enter key press
                            size="small"
                            auto-focus='false'
                        />
                    </Badge>
                    <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
                    <GridSizeSelector gridSize={gridSize} setGridSize={setGridSize} />
                </Box>
            </Box>


        </div>
    );
};

export default SourceSelectionComponent;
