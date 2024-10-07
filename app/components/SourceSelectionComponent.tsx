import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid2,
    IconButton,
    Drawer,
    Box,
    Chip,
    Badge,
    Popover,
} from '@mui/material';

import AutoCompleteRuns from '@/app/components//AutoCompleteRuns'; // Your existing component
import Operators from '@/app/components/Operators'; // Your existing component
import GridSizeSelector from '@/app/components/GridSelector'; // Your existing component
import { run } from '../types';

type dataselection = {
    selectedRun: run | null,
    sourcesFilter: source[]
}

interface SourceSelectionProps {
    availableRuns: run[],
    dataSelection: dataselection,
    setDataSelection: (dataselection: dataselection) => void,
    inputValue: string,
    setInputValue: (inputValue: string) => void,
    handleValidateSourceSelection: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    inputRef,
    availableTags,
    selectedTags,
    setSelectedTags,
    gridSize,
    setGridSize,
}
const SourceSelectionComponent = ({
    availableRuns,
    dataSelection,
    setDataSelection,
    inputValue,
    setInputValue,
    handleValidateSourceSelection,
    inputRef,
    availableTags,
    selectedTags,
    setSelectedTags,
    gridSize,
    setGridSize,
}: SourceSelectionProps) => {


    

    const sourceIdsCount = inputValue.split(/\s+|,|;/).filter((id) => id.trim()).length;

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
