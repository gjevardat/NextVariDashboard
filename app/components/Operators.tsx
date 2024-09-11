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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Operators({ run, selectedTags, onTagSelect }: { run: run; selectedTags: string[] | undefined; onTagSelect: (tags: string[]) => void; }) {

  const [value, setValue] = React.useState<string[] | null>([]);
  const { data, error, isLoading } = useSWR("/api/getTimeSeriesResultTypes?runid=" + run, fetcher)
  if (!data) return <p>Loading</p>
  const elementsWithId = data.map((element: any, index: number) => ({
    ...element,
    id: index
  }));
  return (


    <Autocomplete
      value={value}
      onChange={(event: any, newValue: string | null) => {
        console.log(newValue[0].tag)
        onTagSelect(setValue([...value,newValue.tag]))
      }
      }
      sx={{ width: 750 }}
      multiple
      options={elementsWithId}
      //getOptionLabel={(option) => option.tag}
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
