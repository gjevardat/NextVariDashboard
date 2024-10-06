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
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoCompleteRuns from '@/app/components//AutoCompleteRuns'; // Your existing component
import Operators from '@/app/components/Operators'; // Your existing component
import GridSizeSelector from '@/app/components/GridSelector'; // Your existing component

const SourceSelectionComponent = ({
  availableRuns,
  selectedRun,
  setSelectedRun,
  inputValue,
  setInputValue,
  handleValidateSourceSelection,
  inputRef,
  availableTags,
  selectedTags,
  setSelectedTags,
  gridSize,
  setGridSize,
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApplyFilters = () => {
    // Apply your filters logic
    handleClose(); // Close the dialog after applying
  };

  return (
    <div>
      {/* Filter Button */}
      <IconButton color="primary" onClick={handleClickOpen} aria-label="open filter dialog">
        <FilterListIcon />
      </IconButton>

      {/* Filter Dialog */}
      <Drawer open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Configure sources selection</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            {/* AutoCompleteRuns */}
            <Grid2 item xs={12} sm={6} sx={{ paddingTop: 2 }}>
              <AutoCompleteRuns
                runs={availableRuns}
                selectedRun={selectedRun}
                onRunSelect={setSelectedRun}
              />
            </Grid2>

            {/* TextField for source IDs */}
            <Grid2 item xs={12} sm={6} sx={{ paddingTop: 2 }}>
              <TextField
                label="Source IDs"
                inputRef={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleValidateSourceSelection}
                size="small"
                fullWidth
              />
            </Grid2>

            {/* Operators (Tag selection) */}
            <Grid2 item xs={12} sm={6} sx={{ paddingTop: 2 }}>
              <Operators
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagSelect={setSelectedTags}
              />
            </Grid2>

            {/* Grid Size Selector */}
            <Grid2 item xs={12} sm={6} sx={{ paddingTop: 2 }}>
              <GridSizeSelector gridSize={gridSize} setGridSize={setGridSize} />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleApplyFilters} color="primary" variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Drawer>
    </div>
  );
};

export default SourceSelectionComponent;
