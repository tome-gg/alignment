/**
 * Example component demonstrating the GitHub Repository API Service
 */

'use client';

import React, { useState } from 'react';
import { useGitHubRepository } from '../hooks/useGitHubRepository';
import { RepositoryParams } from '../types/github-repository';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Divider,
  Link
} from '@mui/material';

export default function RepositoryViewer() {
  const [params, setParams] = useState<RepositoryParams | null>(null);
  const [formData, setFormData] = useState({
    source: 'github.com/darrensapalo/founder',
    training: 'dsu-reports.yaml',
    eval: 'eval-self.yaml'
  });

  const { data, loading, error, isReady, sourceUrl } = useGitHubRepository(params);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.training && formData.eval) {
      setParams(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        GitHub Repository Viewer
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Fetch and display training data and evaluations from public GitHub repositories.
      </Typography>

      {/* Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Repository Parameters
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="GitHub Repository"
              placeholder="github.com/username/repository"
              value={formData.source}
              onChange={handleInputChange('source')}
              fullWidth
              required
            />
            <TextField
              label="Training Data File"
              placeholder="training-data.yaml"
              value={formData.training}
              onChange={handleInputChange('training')}
              fullWidth
              required
            />
            <TextField
              label="Evaluation Data File"
              placeholder="evaluation-data.yaml"
              value={formData.eval}
              onChange={handleInputChange('eval')}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {loading ? <CircularProgress size={20} /> : 'Load Repository Data'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Display */}
      {isReady && data && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Repository Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Repository Information
              </Typography>
              <Typography variant="body1">
                <strong>Student:</strong> {data.repository.student.name}
              </Typography>
              {sourceUrl && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Source:</strong>{' '}
                  <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
                    {sourceUrl}
                  </Link>
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Training Goals */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Goals
              </Typography>
              <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                {JSON.stringify(data.training.meta.goal, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Evaluation Dimensions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evaluation Dimensions
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Evaluator: {data.evaluation.meta.evaluator}
              </Typography>
              <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                {JSON.stringify(data.evaluation.meta.dimensions, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Training Entries */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Entries ({data.processedTraining.length} entries)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.processedTraining.slice(0, 5).map((entry, index) => (
                  <Box key={entry.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {entry.datetimeReadable}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Score: {entry.eval.score}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {entry.dateTimeRelative}
                    </Typography>
                    {entry.doing_today && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Doing Today:
                        </Typography>
                        <Box 
                          dangerouslySetInnerHTML={{ __html: entry.doing_today }}
                          sx={{ ml: 2, '& p': { margin: '0.5em 0' } }}
                        />
                      </Box>
                    )}
                    {entry.done_yesterday && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Done Yesterday:
                        </Typography>
                        <Box 
                          dangerouslySetInnerHTML={{ __html: entry.done_yesterday }}
                          sx={{ ml: 2, '& p': { margin: '0.5em 0' } }}
                        />
                      </Box>
                    )}
                    {entry.blockers && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Blockers:
                        </Typography>
                        <Box 
                          dangerouslySetInnerHTML={{ __html: entry.blockers }}
                          sx={{ ml: 2, '& p': { margin: '0.5em 0' } }}
                        />
                      </Box>
                    )}
                    {index < data.processedTraining.slice(0, 5).length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
                {data.processedTraining.length > 5 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    ... and {data.processedTraining.length - 5} more entries
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
