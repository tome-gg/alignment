/**
 * Example component demonstrating the GitHub Repository API Service
 */

'use client';

import React, { useState } from 'react';
import { useGitHubRepository } from '../hooks/useGitHubRepository';
import { RepositoryParams, getDimensionDisplayName } from '../types/github-repository';
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
    source: 'github.com/darrensapalo/founder'
  });

  const { data, loading, error, isReady, sourceUrl } = useGitHubRepository(params);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source) {
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
        Automatically crawls and displays all training data and evaluations from public GitHub repositories.
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
              helperText="All training and evaluation files will be automatically discovered"
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

          {/* Training Files */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Files ({data.trainings.length} files)
              </Typography>
              {data.trainings.map((training, idx) => (
                <Box key={training.filename} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {training.filename}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Path: {training.path}
                  </Typography>
                  <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(training.data.meta.goal, null, 2)}
                  </pre>
                  {idx < data.trainings.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Evaluation Files */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evaluation Files ({data.evaluations.length} files)
              </Typography>
              {data.evaluations.map((evaluation, idx) => (
                <Box key={evaluation.filename} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {evaluation.filename}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Evaluator: {typeof evaluation.data.meta.evaluator === 'string' 
                      ? evaluation.data.meta.evaluator 
                      : evaluation.data.meta.evaluator.name}
                  </Typography>
                  
                  {/* Display dimensions */}
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Available Dimensions:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {Array.isArray(evaluation.data.meta.dimensions) ? (
                      evaluation.data.meta.dimensions.map((dim: any, dimIdx: number) => (
                        <Box key={dimIdx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {dim.label || dim.name || dim.alias}
                          </Typography>
                          {dim.definition && (
                            <Typography variant="caption" color="text.secondary">
                              {dim.definition}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '100px' }}>
                        {JSON.stringify(evaluation.data.meta.dimensions, null, 2)}
                      </pre>
                    )}
                  </Box>

                  {/* Display evaluation entries with multiple dimensions */}
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Evaluation Entries ({evaluation.data.evaluations.length} entries):
                  </Typography>
                  <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {evaluation.data.evaluations.slice(0, 5).map((entry) => (
                      <Box key={entry.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Entry ID: {entry.id}
                        </Typography>
                        {entry.measurements && entry.measurements.length > 0 ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                              Measurements ({entry.measurements.length} dimensions):
                            </Typography>
                            {entry.measurements.map((measurement, measurementIdx) => (
                              <Box key={measurementIdx} sx={{ mb: 1, ml: 2 }}>
                                <Typography variant="body2">
                                  <strong>{getDimensionDisplayName(measurement.dimension, evaluation.data.meta.dimensions)}:</strong> {measurement.score}/5
                                </Typography>
                                {(measurement.remarks || measurement.notes || measurement.comment) && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {measurement.remarks || measurement.notes || measurement.comment}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No measurements available
                          </Typography>
                        )}
                      </Box>
                    ))}
                    {evaluation.data.evaluations.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        ... and {evaluation.data.evaluations.length - 5} more entries
                      </Typography>
                    )}
                  </Box>
                  
                  {idx < data.evaluations.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Processed Training Entries */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processed Training Entries
              </Typography>
              {data.processedTrainings.map((processedTraining, trainingIdx) => (
                <Box key={processedTraining.filename} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {processedTraining.filename} ({processedTraining.data.length} entries)
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {processedTraining.data.slice(0, 3).map((entry, index) => (
                      <Box key={entry.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
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
                        {index < processedTraining.data.slice(0, 3).length - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                    {processedTraining.data.length > 3 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        ... and {processedTraining.data.length - 3} more entries
                      </Typography>
                    )}
                  </Box>
                  {trainingIdx < data.processedTrainings.length - 1 && <Divider sx={{ mt: 3 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
