import React, { useEffect, useState } from 'react';
import { useWebSocketMessages } from '../../Webhooktypeprocess';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setTradingWatchlistPersist } from '../../redux/TradingWatchlistSlice';

interface RowData {
  symbol: string;
  last: string | number;
  change: string | number;
}

interface pointDataPropstypes {
  setwatchlistselectrow?:any
}

const PointData: React.FC = () => {
  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat();

  const options = [
    { id: 1, label: 'Nifty', value: 26000 },
    { id: 2, label: 'Banknifty', value: 26009 },
    { id: 3, label: 'Niftynxt50', value: 26013 },
    { id: 4, label: 'Finnifty', value: 26037 },
    { id: 5, label: 'Midcap Nifty', value: 26014 },
  ];

  const [dataMap, setDataMap] = useState<Record<string, RowData>>({});
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    // Process incoming webhook data
    webhookcontrol.forEach((item: any) => {
      if (item.type === 'index' && item.data?.tk) {
        const { tk, lp, pc } = item.data;
        setDataMap((prev) => {
          const previousData = prev[tk] || {};
          return {
            ...prev,
            [tk]: {
              symbol: getSymbolLabel(tk),
              last: lp && lp !== '0' ? lp : previousData.last || 0,
              change: pc && pc !== '0' ? pc : previousData.change || 0,
            },
          };
        });
      }
    });
  }, [webhookcontrol]);

  const getSymbolLabel = (tk: string) => {
    const match = options.find((option) => option.value.toString() === tk);
    return match ? match.label : 'Unknown';
  };

  const handleRowClick = (row: RowData, option:any) => {
    // console.log("selected row : ",option)
    setSelectedRow(row);
    // setwatchlistselectrow(option)
    dispatch(setTradingWatchlistPersist(option));

  };

  

  console.log("dataMap : ",dataMap)

  return (
    <Box>
      {/* Watchlist Header */}

      {/* Table Section */}
      <TableContainer component={Paper}>
      <Typography
              variant="h6"
              component="div"
              style={{ padding: "12px 16px", fontWeight: 600 }}
              gutterBottom
            >
              Watchlist
            </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontSize:'12px'}}>Symbol</TableCell>
              <TableCell align="right" sx={{fontSize:'12px'}}>Last</TableCell>
              <TableCell align="right" sx={{fontSize:'12px'}}>Change</TableCell>
              <TableCell align="right" sx={{fontSize:'12px'}}>Chg%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => {
              const rowData = dataMap[option.value.toString()] || {
                symbol: option.label,
                last: 0,
                change: 0,
              };
              return (
                <TableRow
                  key={option.id}
                  onClick={() => handleRowClick(rowData,option)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      selectedRow?.symbol === rowData.symbol ? '#f0f0f0' : 'inherit',
                  }}
                >
                  <TableCell component="th" scope="row" sx={{fontSize:'12px'}}>
                    {rowData.symbol}
                  </TableCell>
                  <TableCell align="right" sx={{fontSize:'12px'}}>{rowData.last}</TableCell>
                  <TableCell
                    align="right"
                    style={{ color: rowData.change.toString().startsWith('-') ? 'red' : 'green', fontSize:'12px' }}
                  >
                    {rowData.change}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: rowData.change.toString().startsWith('-') ? 'red' : 'green', fontSize:'12px' }}
                  >
                    {parseFloat(rowData.change as string).toFixed(2)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Section for Detailed Data */}
      {selectedRow && (
        <Box sx={{mt:0.5,mb:0.5}} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6">{selectedRow.symbol}</Typography>
          <Typography
            variant="h4"
            style={{
              color: selectedRow.change.toString().startsWith('-') ? 'red' : 'green',
            }}
          >
            {selectedRow.last}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: selectedRow.change.toString().startsWith('-') ? 'red' : 'green',
            }}
          >
            Change: {selectedRow.change}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PointData;