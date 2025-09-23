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
      source: repositoryParams.source,
      training: repositoryParams.training,
      eval: repositoryParams.eval
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Box sx={{ 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          py: 2
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
              <Image src="/tome_gg_logo.avif" alt="Tome.gg" width={32} height={32} />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                Tome.gg
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
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
