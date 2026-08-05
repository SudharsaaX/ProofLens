import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Alert,
} from '@mui/material'
import { Download, CheckCircle, XCircle } from 'lucide-react'
import UploadZone from './UploadZone'
import LoadingSpinner from './LoadingSpinner'
import AnimatedButton from './AnimatedButton'

const API_BASE = import.meta.env.VITE_API_URL;

export default function PrivacyCleanerTab() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [options, setOptions] = useState({
    remove_exif: true,
    remove_gps: true,
    remove_camera: true,
    remove_iptc: true,
    remove_xmp: true,
  })

  const handleOptionChange = (key) => (event) => {
    setOptions((prev) => ({
      ...prev,
      [key]: event.target.checked,
    }))
  }

  const handleCleanImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('remove_exif', String(options.remove_exif))
    formData.append('remove_gps', String(options.remove_gps))
    formData.append('remove_camera', String(options.remove_camera))
    formData.append('remove_iptc', String(options.remove_iptc))
    formData.append('remove_xmp', String(options.remove_xmp))

    try {
      const response = await fetch(`${API_BASE}/api/clean`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || errData.error || 'Failed to clean image.')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred during cleaning.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result?.download_id) return
    window.location.href = `${API_BASE}/api/download/${result.download_id}`
  }

  const getStatus = (label, originalFound, afterFound) => {
    if (!originalFound) return { label, status: 'Not Present Initially' }
    return {
      label,
      status: afterFound ? 'Failed to Remove' : 'Removed Successfully',
      success: !afterFound
    }
  }

  const originalExif = result?.original?.exif?.found
  const originalIptc = result?.original?.iptc?.found
  const originalXmp = result?.original?.xmp?.found
  const afterExif = result?.cleaned?.exif?.found
  const afterIptc = result?.cleaned?.iptc?.found
  const afterXmp = result?.cleaned?.xmp?.found

  const compareItems = result ? [
    getStatus('EXIF Metadata', originalExif, afterExif),
    getStatus('IPTC Metadata', originalIptc, afterIptc),
    getStatus('XMP Manifests', originalXmp, afterXmp),
  ].filter(i => i.status !== 'Not Present Initially') : []

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <UploadZone
        onFileSelect={setFile}
        selectedFile={file}
        onClear={() => { setFile(null); setResult(null); setError(null) }}
        isLoading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {file && !loading && !result && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
              Select Metadata to Remove
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
              <FormControlLabel
                control={<Checkbox checked={options.remove_exif} onChange={handleOptionChange('remove_exif')} />}
                label={<Typography variant="body1">All EXIF Metadata</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={options.remove_gps} onChange={handleOptionChange('remove_gps')} />}
                label={<Typography variant="body1">GPS Location Coordinates</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={options.remove_camera} onChange={handleOptionChange('remove_camera')} />}
                label={<Typography variant="body1">Camera Information (Make, Model, Lens)</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={options.remove_iptc} onChange={handleOptionChange('remove_iptc')} />}
                label={<Typography variant="body1">IPTC Attributes</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={options.remove_xmp} onChange={handleOptionChange('remove_xmp')} />}
                label={<Typography variant="body1">XMP Manifests</Typography>}
              />
            </Box>

            <AnimatedButton
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCleanImage}
              sx={{ py: 1.5 }}
            >
              Clean Image
            </AnimatedButton>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box sx={{ mt: 6 }}>
          <LoadingSpinner message="Cleaning metadata losslessly..." />
        </Box>
      )}

      {result && (
        <Card sx={{ mt: 4, animation: 'fadeIn 0.25s ease-in' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
              Cleaning Results
            </Typography>

            {compareItems.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {compareItems.map(item => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" color="text.primary">
                      {item.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.success ? <CheckCircle size={18} color="#16A34A" /> : <XCircle size={18} color="#DC2626" />}
                      <Typography variant="body2" color={item.success ? 'success.main' : 'error.main'} fontWeight={500}>
                        {item.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
                No removable metadata was found in the original image.
              </Typography>
            )}

            <Divider sx={{ mb: 4 }} />

            <AnimatedButton
              variant="contained"
              fullWidth
              size="large"
              onClick={handleDownload}
              startIcon={<Download size={18} />}
              sx={{ py: 1.5 }}
            >
              Download Clean Image
            </AnimatedButton>
          </CardContent>

        </Card>
      )}
    </Box>
  )
}
