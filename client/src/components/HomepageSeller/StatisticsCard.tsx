import React from 'react'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { CardHeader, Avatar, CardContent, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

interface StatisticsCardProps {
  icon: React.ReactNode;
  title: string;
  subheader: string;
  percentage: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ icon, title, subheader, percentage }) => {

  return (
    <Grid item xs={12} md={6} lg={3}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: blue[500] }} aria-label="icon-label">
              {icon}
            </Avatar>
          }
          title={title}
          subheader={subheader}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {percentage}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StatisticsCard