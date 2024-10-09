'use client'
import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Box,
  alpha
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Create a theme that mimics shadcn's aesthetic
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#020817', // shadcn primary color
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#020817',
      secondary: '#64748b', // Muted text color similar to shadcn
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.05em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          border: '1px solid',
          borderColor: '#e2e8f0',
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            backgroundColor: alpha('#000', 0.01),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#020817',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1a1a1a',
          },
        },
      },
    },
  },
});

type CardProps = {
  href: string,
  title:string,
  description:string
}
const DashboardCard = ({ href, title, description }:CardProps) => {
  return (
    <Card>
      <CardContent sx={{ p: 6 }}>
        <Typography variant="h6" gutterBottom component="h2">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          disableElevation
        >
          Open Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

const EntryPointPage = () => {
  const dashboards = [
    {
      href: "http://localhost:50080/VariDashboardDR3_ops_cs36_xz/",
      title: "VariDashboard DR3",
      description: "All runs on the old database: big run, DR3 exported runs etc."
    },
    {
      href: "http://localhost:3000/photometry",
      title: "VariDashboard DR4",
      description: "All DR4 runs on the new database."
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h1" component="h1" gutterBottom>
              Dashboard Selection
            </Typography>
            <Typography variant="body2">
              Choose a dashboard to view your data
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {dashboards.map((dashboard, index) => (
              <Grid item xs={12} md={6} key={index}>
                <DashboardCard {...dashboard} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default EntryPointPage;