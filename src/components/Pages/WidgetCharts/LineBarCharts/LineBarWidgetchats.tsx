import { ResponsiveLine } from '@nivo/line';
import { Box, Paper, Typography } from '@mui/material';
import './LineBarWidgetchats.css'

export const LineBarWidgetchats = ({ data }: any) => {
  // Custom tooltip component using Material UI for styling
  const ApplicationUsageCustomTooltips = ({ id, xValue, yValue, color }: any) => {
    return (
        <Box className="backgrounddash">
        <Paper elevation={3} className="backgrounddash" style={{ padding: '10px', backgroundColor: color }}>
            <Typography variant="body2" color="textPrimary">
            <strong>{id}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
            X: {xValue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
            Y: {yValue}
            </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      lineWidth={2}
      curve="catmullRom"
      areaBlendMode="darken"
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickValues: 5,
        legend: 'Count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableSlices="x"
      colors={['red', 'green', 'blue', '#ff00ff']}
      pointSize={5}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={7}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      pointLabel="data.yFormatted"
      enableTouchCrosshair={true}
      enableArea={true}
      enablePointLabel={true}
      enableGridX={false}
      enableGridY={true}
      tooltip={(point) => (
        <ApplicationUsageCustomTooltips
          id={point.point.id}
          xValue={point.point.data.x}
          yValue={point.point.data.y}
          color={point.point.serieColor}
        />
      )}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};
