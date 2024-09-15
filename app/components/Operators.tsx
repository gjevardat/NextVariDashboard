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
import { run } from  '@/app/types';

import useSWR from 'swr'



interface timeseriestag {
  tag: string,
  bandpass: string,
  domain: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Operators({ run, selectedTags, onTagSelect }: { run: run; selectedTags: string[] ; onTagSelect: (tags: string[]) => void; }) {

  const [value, setValue] = React.useState<string[]>(selectedTags);
  
  const { data, error, isLoading } = useSWR("/api/getTimeSeriesResultTypes?runid=498", fetcher)
  if (!data) return <p>Loading</p>

  //setValue((oldValue)=>{return selectedTags})
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
      sx={{ width: 1250 }}
      multiple
      options={options}
      //defaultValue={selectedTags}
      // getOptionLabel={(option) => option}
      size='small'
    
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search time series tag"
        //placeholder="Favorites"
        />
      )}
    />
  );
};
