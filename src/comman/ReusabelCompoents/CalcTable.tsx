import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

interface CalcTableProps {
    dataTable: { [key: string]: any }; // Define the structure of dataTable as key-value pairs
  }
  
  export default function CalcTable({ dataTable }: CalcTableProps) {
    // Convert the dataTable into an array of key-value pairs
    const rows = Object.entries(dataTable);
  
    return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>S.No</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Fields</TableCell>
              <TableCell align="left" sx={{fontWeight:'bold'}}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(([key, value], index) => (
              <TableRow key={key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{key}</TableCell>
                <TableCell align="left">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    );
  }