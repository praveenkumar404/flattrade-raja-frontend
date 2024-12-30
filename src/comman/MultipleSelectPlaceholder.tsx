import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDropdownValues } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { Box } from '@mui/material';

interface Option {
  id: number;
  label: string;
  value: any;
}

interface MultipleSelectWithSearchProps {
  options: Option[];
  placeholder?: string;
  onSelect: (selectedOptions: Option[]) => void;
  isMultiSelect: boolean; // New prop to allow single or multi selection
}


const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 6px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: 'dodgerblue',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  });
  
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: 'dodgerblue',
    '&:hover': {
      backgroundColor: purple[700],
    },
  }));


export default function MultipleSelectWithSearch({
  options,
  placeholder = 'Select',
  onSelect,
  isMultiSelect,
}: MultipleSelectWithSearchProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filteredOptions, setFilteredOptions] = React.useState<Option[]>(options);

  const dispatch = useDispatch();
  const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter(option => option.label.toLowerCase().includes(term.toLowerCase()))
    );
  };


  const handleSelect = (value: string) => {
    let newSelectedValues: string[];

    if (isMultiSelect) {
      if (selectedValues.includes(value)) {
        newSelectedValues = selectedValues.filter(v => v !== value);
      } else {
        newSelectedValues = [...selectedValues, value];
      }
    } else {
      newSelectedValues = [value];
      handleClose();
    }

    setSelectedValues(newSelectedValues);

    const selectedOptions = options.filter(option => newSelectedValues.includes(option.value));
    onSelect(selectedOptions);

    // Dispatch selected options to Redux
    dispatch(setSelectedDropdownValues(selectedOptions));

    setTimeout(()=>{
      window?.location?.reload()
    },200)
  };

  // const selectedLabels = options
  //   .filter(option => selectedValues.includes(option.value))
  //   .map(option => option.label);

 const selectedLabels = selectedDropdownValues.map(option => option.label).join(', ');

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
        <ColorButton variant="contained" onClick={handleClick} endIcon={anchorEl ? <KeyboardArrowUpIcon />:<KeyboardArrowDownIcon/>}>
          {/* {selectedValues.length === 0 ? placeholder : selectedValues.join(', ')} */}
          {/* {selectedLabels.length === 0 ? placeholder : selectedLabels.join(', ')} */}
          {selectedDropdownValues.length === 0 ? placeholder : selectedLabels}
        </ColorButton>
        <Popover
          id="select-popover"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '300px',
            },
          }}
        >
          <List>
            <ListItem>
              <TextField
                autoFocus
                placeholder="Search..."
                fullWidth
                variant="standard"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </ListItem>
            {filteredOptions.map((option) => (
              <ListItem
                key={option.id}
                onClick={() => handleSelect(option.value)}
                style={{
                  fontWeight: selectedValues.includes(option.value)
                    ? theme.typography.fontWeightMedium
                    : theme.typography.fontWeightRegular,
                }}
              >
                {isMultiSelect && (
                  <Checkbox checked={selectedValues.includes(option.value)} />
                )}
                {option.label}
              </ListItem>
            ))}
          </List>
        </Popover>
      </FormControl>
    </div>
  );
}