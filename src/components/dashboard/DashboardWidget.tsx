import { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
}

/**
 * Wrapper for dashboard widgets. Use this for every new widget so the layout stays consistent.
 */
const DashboardWidget = ({ title, children }: DashboardWidgetProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ flex: 1, minHeight: 300 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
