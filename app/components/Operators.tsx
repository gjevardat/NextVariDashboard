'use client'

import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import useSWR from 'swr'


interface run {
  runid: number,
  runname: string
}

interface timeseriestag {
  tag: string,
  bandpass: string,
  domain: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Operators({ run, selectedTags, onTagSelect }: { run: run; selectedTags: string[] | undefined; onTagSelect: (tags: string[]) => void; }) {

  const [value, setValue] = React.useState<string[]>([]);
  const { data, error, isLoading } = useSWR("/api/getTimeSeriesResultTypes?runid=" + run, fetcher)
  if (!data) return <p>Loading</p>

  const options: string[] = data.map((element: timeseriestag, index: number) => (element.tag));

  return (


    <Autocomplete
      value={value}
      onChange={(event: any, newValue: string[] ) => {
        if (newValue) {
          // Update the value state with the new selected values
          setValue(newValue);

          // Log the updated values
          console.log("new selected tags in combo box:", newValue);
          newValue.forEach((v) => console.log("values are now:", v));

          // Call onTagSelect with the updated values
          onTagSelect(newValue);
        }
      }
      }
      sx={{ width: 750 }}
      multiple
      options={options}
      // getOptionLabel={(option) => option}
      defaultValue={[]}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search time series tag"
        //placeholder="Favorites"
        />
      )}
    />



    // <List sx={{ width: '100%', height: '30%', bgcolor: 'background.paper', overflow: 'auto' }}>
    //   {elementsWithId.map((value:any) => {
    //     const labelId = `checkbox-list-label-${value.id}`;

    //     return (
    //       <ListItem key={value.id}>
    //         <ListItemButton onClick={handleToggle(value)}>
    //         <ListItemIcon>
    //           <Checkbox
    //             edge="start"
    //             checked={checked.indexOf(value.id) !== -1}
    //             tabIndex={-1}
    //             disableRipple
    //             inputProps={{ 'aria-labelledby': labelId }}
    //             />
    //         </ListItemIcon>
    //         </ListItemButton>
    //         <ListItemText id={value.id} primary={value.tag} />

    //       </ListItem>
    //     );
    //   })}
    // </List>
  );
};
