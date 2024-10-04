import React, { useState } from 'react';
import { Button, Menu, MenuItem, TextField, } from '@mui/material';

interface GridSizeProps {
  gridSize: {
    x: number,
    y: number
  },
  setGridSize: ({x, y}: {x:number, y:number}) => void
}

const GridSizeSelector = ({ gridSize, setGridSize }: GridSizeProps) => {


  const handleChangeCols = (event:any) => {
    const newValue = event.target.value;
    setGridSize({x:newValue,y:gridSize.y});
  };

  const handleChangeRows = (event:any) => {
    const newValue = event.target.value;
    setGridSize({x:gridSize.x,y:newValue});
  };

  return (
    <div>
      <TextField 
        label="cols" 
        defaultValue={gridSize.x} 
        size="small" 
        type="number" 
        onChange={handleChangeCols}
        inputProps={{ min: 1, max: 4 }}
         />
      <TextField 
        label="rows"
        defaultValue={gridSize.y}
        size="small"
        type="number"
        onChange={handleChangeRows}
        inputProps={{ min: 1, max: 4 }}
        />
    </div>

  );
};

export default GridSizeSelector;
