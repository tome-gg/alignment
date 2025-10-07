'use client';

import { Typography, Box, Container, Link } from '@mui/material';
import Image from 'next/image';
import { useTomeSWR } from '../contexts/TomeContextSWR';

export default function Header() {
  const { getRepositoryUrl, getStudentName, error, repositoryParams } = useTomeSWR();

  const repositoryUrl = getRepositoryUrl();
  const studentName = getStudentName();

  // Generate tome.gg URL for error states
  const generateCurrentTomeUrl = (): string => {
    let baseUrl = "https://tome.gg";
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    }
    const params = new URLSearchParams({
      source: repositoryParams.source
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Box sx={{ 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      bgcolor: 'background.default',
      // Prevent layout shift
      minHeight: '80px',
      contain: 'layout'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          py: 2,
          minHeight: '64px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link 
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 8, 
                textDecoration: 'none', 
                cursor: 'pointer', 
                color: 'black' 
              }} 
              href="/" 
              rel="noopener noreferrer"
            > 
              <Image 
                src="/tome_gg_logo.avif" 
                alt="Tome.gg" 
                width={32} 
                height={32}
                priority
                style={{ width: '32px', height: '32px' }}
              />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                Tome.gg
              </Typography>
            </Link>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            minWidth: '200px', // Reserve space to prevent shift
            transition: 'opacity 0.2s ease'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'text.primary',
                transition: 'color 0.2s ease'
              }}
            >
              {error ? 'Growth journal not found' : (studentName || 'darrensapalo')}
            </Typography>
            {error ? (
              <Link
                href={generateCurrentTomeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'underline',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {repositoryUrl}
              </Link>
            ) : repositoryUrl ? (
              <Link
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'underline',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Growth Journal
              </Link>
            ) : null}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
