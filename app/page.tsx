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
  alpha,
  IconButton,
  Snackbar,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#020817',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#020817',
      secondary: '#64748b',
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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px !important',
          '&:last-child': {
            paddingBottom: '24px !important',
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
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: '24px',
        },
      },
    },
  },
});

const CodeBox = () => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const sshCommand = "ssh -L 50080:localhost:50080 -L 53001:localhost:53001 username@login01.astro.unige.ch";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sshCommand);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const customStyle = {
    backgroundColor: '#1a1a1a',
    margin: 0,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        SSH Tunnel Command
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        To access the dashboards, first establish an SSH tunnel using this command:
      </Typography>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#1a1a1a',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'stretch', // Changed to stretch to match heights
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <SyntaxHighlighter
            language="bash"
            style={atomDark}
            customStyle={customStyle}
          >
            {sshCommand}
          </SyntaxHighlighter>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1,
          }}
        >
          <IconButton 
            onClick={handleCopy}
            sx={{ 
              color: '#ffffff',
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              },
            }}
            aria-label="copy ssh command"
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Command copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
type CardProps = {
  href: string,
  title:string,
  description:string
}
const DashboardCard = ({ href, title, description }:CardProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom component="h2">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {description}
          </Typography>
        </Box>
        <Box>
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
        </Box>
      </CardContent>
    </Card>
  );
};

const EntryPointPage = () => {
  const dashboards = [
    {
      href: "http://localhost:50080/VariDashboardDR3_ops_cs36_xz/",
      title: "VariDashboard DR3",
      description: "All runs on the old database launched with VariConfiguration 22.5.1 or before: big run, DR3 exported runs."
    },
    {
      href: "http://localhost:53001/photometry/",
      title: "VariDashboard DR4",
      description: "All DR4 runs on the new database launched with VariConfiguration 22.5.1 or before."
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

          <CodeBox />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default EntryPointPage;
