import React, { useState } from 'react'
import { Box, Button, Alert } from '@mui/material'
import { Search } from 'lucide-react'
import UploadZone from './UploadZone'
import LoadingSpinner from './LoadingSpinner'
import AnalysisReport from './AnalysisReport'
import AnimatedButton from './AnimatedButton'

const API_BASE = import.meta.env.VITE_API_URL;

export default function InspectImageTab() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setAnalysis(null)
    setError(null)
  }

  const handleClearFile = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || errData.error || 'Failed to analyze image.')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <UploadZone
        onFileSelect={handleFileSelect}
        selectedFile={file}
        onClear={handleClearFile}
        isLoading={loading}
        actionButton={
          file && !loading ? (
            <AnimatedButton
              variant="contained"
              onClick={handleAnalyze}
              size="small"
              sx={{ px: 3, borderRadius: 2 }}
            >
              Analyze Image
            </AnimatedButton>
          ) : null
        }
      />
      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <LoadingSpinner message="Inspecting Content Credentials, C2PA signatures, and metadata..." />
      )}
      {analysis && !loading && <AnalysisReport analysis={analysis} />}
    </Box>
  )
}
