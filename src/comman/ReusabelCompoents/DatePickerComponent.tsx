import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import { Box } from '@mui/material';

interface DatePickerComponentProps {
  id: string;
  label:string;
  format: string;  // New format prop
  onChange: (value: Date | null, id: string) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ id, label, format, onChange }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(23, 59, 59)));
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date, id);  // Trigger the passed onChange with component id
  };

  return (
    <Box>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container style={{ backgroundColor: '#fff', borderRadius: '5px', width: 'fit-content', padding: '5px', paddingLeft:'15px', paddingRight:'15px' , boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
          {selectedDate && (
            <KeyboardDatePicker
              margin="normal"
              id={id}
              label={label}
              format={format}  // Apply the format prop
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          )}
        </Grid>
      </MuiPickersUtilsProvider>
    </Box>
  );
};

export default DatePickerComponent;