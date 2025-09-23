'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { SWRCacheManager, SWRPerformanceMonitor } from '../utils/swr-cache';

interface SWRDebuggerProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Development-only SWR cache debugger component
 * Shows cache stats, allows cache manipulation, and monitors performance
 */
export function SWRDebugger({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right'
}: SWRDebuggerProps) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Initialize with default values to prevent hydration mismatch
  const [cacheStats, setCacheStats] = useState({
    totalCacheEntries: 0,
    repositoryCacheEntries: 0,
    cacheKeys: [] as string[],
    repositoryKeys: [] as string[]
  });
  const [memoryUsage, setMemoryUsage] = useState({
    totalSizeBytes: 0,
    totalSizeKB: 0,
    totalSizeMB: 0
  });

  const refreshStats = useCallback(() => {
    if (mounted) {
      setCacheStats(SWRCacheManager.getCacheStats());
      setMemoryUsage(SWRCacheManager.getMemoryUsage());
      setLastUpdated(new Date().toLocaleTimeString());
      setRefreshKey(prev => prev + 1);
    }
  }, [mounted]);

  // Initialize on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setCacheStats(SWRCacheManager.getCacheStats());
    setMemoryUsage(SWRCacheManager.getMemoryUsage());
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (expanded && mounted) {
      const interval = setInterval(refreshStats, 2000);
      return () => clearInterval(interval);
    }
  }, [expanded, mounted, refreshStats]);

  if (!enabled) return null;

  const positionStyles = {
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
  };

  const handleClearRepositoryCache = () => {
    if (mounted) {
      SWRCacheManager.clearRepositoryCache();
      refreshStats();
    }
  };

  const handleClearAllCache = () => {
    if (mounted) {
      SWRCacheManager.clearAllCache();
      refreshStats();
    }
  };

  const handlePerformanceTrack = () => {
    SWRPerformanceMonitor.trackCachePerformance();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 9999,
        maxWidth: expanded ? 600 : 'auto',
        minWidth: expanded ? 400 : 'auto',
      }}
    >
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              SWR Cache Debugger
            </Typography>
            <Box>
              <IconButton size="small" onClick={refreshStats}>
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setExpanded(!expanded)}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip 
              size="small" 
              label={`${cacheStats.totalCacheEntries} entries`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              size="small" 
              label={`${memoryUsage.totalSizeKB}KB`}
              color="secondary"
              variant="outlined"
              icon={<MemoryIcon />}
            />
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
                Development tool for monitoring SWR cache performance
              </Alert>

              {/* Cache Statistics */}
              <Typography variant="subtitle2" gutterBottom>
                Cache Statistics
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2, maxHeight: 200 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Entries</TableCell>
                      <TableCell align="right">{cacheStats.totalCacheEntries}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Repository Entries</TableCell>
                      <TableCell align="right">{cacheStats.repositoryCacheEntries}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Memory Usage (KB)</TableCell>
                      <TableCell align="right">{memoryUsage.totalSizeKB}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Memory Usage (MB)</TableCell>
                      <TableCell align="right">{memoryUsage.totalSizeMB}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Cache Actions */}
              <Typography variant="subtitle2" gutterBottom>
                Cache Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={handleClearRepositoryCache}
                  startIcon={<DeleteIcon />}
                >
                  Clear Repository Cache
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleClearAllCache}
                  startIcon={<DeleteIcon />}
                >
                  Clear All Cache
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  onClick={handlePerformanceTrack}
                  startIcon={<SpeedIcon />}
                >
                  Track Performance
                </Button>
              </Box>

              {/* Cache Keys */}
              {cacheStats.repositoryKeys.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Repository Cache Keys
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
                    {cacheStats.repositoryKeys.map((key, index) => {
                      let displayKey = key;
                      try {
                        // Try to parse if it's a JSON string representing an array
                        const parsedKey = JSON.parse(key);
                        if (Array.isArray(parsedKey)) {
                          displayKey = `[${parsedKey.join(', ')}]`;
                        }
                      } catch {
                        // Not JSON, use as-is
                        displayKey = key;
                      }
                      
                      return (
                        <Typography 
                          key={index} 
                          variant="caption" 
                          component="div"
                          sx={{ 
                            fontFamily: 'monospace', 
                            backgroundColor: 'grey.100', 
                            p: 0.5, 
                            mb: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          {displayKey}
                        </Typography>
                      );
                    })}
                  </Box>
                </>
              )}

              <Typography variant="caption" color="text.secondary">
                {lastUpdated ? `Last updated: ${lastUpdated}` : 'Click refresh to update'}
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}
