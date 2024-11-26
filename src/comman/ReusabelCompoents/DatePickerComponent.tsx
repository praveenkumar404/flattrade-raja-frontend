import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box } from '@mui/material';

interface DatePickerComponentProps {
  id: string;
  label:string;
  placeholderdiplay: string;
  format: string;  // New format prop
  onChange: (value: Date | null, id: string) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ id, label, placeholderdiplay, format, onChange }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>();
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date, id);  // Trigger the passed onChange with component id
  };

  return (
    <Box>
        <Box style={{ backgroundColor: '#fff', borderRadius: '5px', width: 'fit-content', padding: '15px' , boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
          {/* {selectedDate && ( */}
            <>
            <label htmlFor={id} style={{ marginBottom: '5px', display: 'block' , color:'dodgerblue'}}>
              {label}
            </label>
            <DatePicker
              id={id}
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat={format} // Uses format prop
              placeholderText={`${placeholderdiplay} (${format})`}
              isClearable
              className="date-picker-inputn mydatepickermodify"
              wrapperClassName="date-picker-wrapper"
            />
            </>
          {/* )} */}
        </Box>
    </Box>
  );
};

export default DatePickerComponent;