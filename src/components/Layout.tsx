import { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import NavigationBar from './NavigationBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <NavigationBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          marginLeft: { sm: '250px' },
          marginTop: theme.mixins.toolbar.minHeight ?? '64px',
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 