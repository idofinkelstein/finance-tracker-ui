import { Grid } from '@mui/material';
import { DashboardWidget, BalanceOverTimeChart } from '../components/dashboard';

/**
 * Dashboard page: widget-based layout. Add new widgets by importing them and
 * adding a new <Grid item> with <DashboardWidget>.
 */
const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DashboardWidget title="Balance over time">
          <BalanceOverTimeChart />
        </DashboardWidget>
      </Grid>
      {/* Add more widgets here, e.g.:
      <Grid item xs={12} md={6}>
        <DashboardWidget title="Spending by category">...</DashboardWidget>
      </Grid>
      */}
    </Grid>
  );
};

export default Dashboard;
