'use client'

import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import useSWR from 'swr'


interface run {
  runid: number,
  runname: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Operators({ run , selectedTags, onTagSelect}: { run: run ; selectedTags:string[] |undefined ; onTagSelect: (tags: string[]) => void; }) {
  

  // Define the initial items and state for checked items
  const [checked, setChecked] = useState<number[]>([]);
  // Handle toggle event
  const handleToggle = (value: any) => () => {
  
    
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    if (selectedTags?.includes(value.tag)) {
      // If tag is already present, remove it
      onTagSelect(selectedTags.filter(tag => tag !== value.tag));
    } else {
      // If tag is not present, add it
      onTagSelect([...(selectedTags || []), value.tag]);
    }

    
     
  };

  const { data, error, isLoading } = useSWR("/api/getTimeSeriesResultTypes?runid=" + run, fetcher)
  if (!data) return <p>Loading</p>
  const elementsWithId = data.map((element: any, index: number) => ({
    ...element,
    id: index
  }));
  return (
    <List sx={{ width: '100%', height: '30%', bgcolor: 'background.paper', overflow: 'auto' }}>
      {elementsWithId.map((value:any) => {
        const labelId = `checkbox-list-label-${value.id}`;

        return (
          <ListItem key={value.id}>
            <ListItemButton onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value.id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItemIcon>
            </ListItemButton>
            <ListItemText id={value.id} primary={value.tag} />

          </ListItem>
        );
      })}
    </List>
  );
};
