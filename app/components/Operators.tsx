
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { timeseriestag } from '@/app/types';





import { styled } from "@mui/material/styles";

const CustomListbox = styled('ul')({
  fontSize: '12px', // Customize the font size here
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Operators({ availableTags, selectedTags, onTagSelect }: { availableTags: timeseriestag[]; selectedTags: string[]; onTagSelect: (tags: string[]) => void; }) {


  const [value, setValue] = React.useState<string[]>(selectedTags);






  const options = availableTags.map((element: timeseriestag, index: number) => (element.tag));
  return (


    <Autocomplete
   
      value={value}
      onChange={(event: any, newValue: string[]) => {
        if (newValue) {
          // Update the value state with the new selected values
          setValue(newValue);

          // Call onTagSelect with the updated values
          onTagSelect(newValue);
        }
      }
      }

      multiple
      options={options}
      
      size='small'
      
      ListboxComponent={CustomListbox}
      
      renderInput={(params) => (
        <TextField
          {...params}
          

          label="Search time series tag"
        />
      )}
    />
  );
}


