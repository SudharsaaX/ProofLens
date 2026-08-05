import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, IconButton, Typography, Paper } from '@mui/material'
import { Camera, X, FileImage } from 'lucide-react'
import { formatBytes } from '../utils/formatters'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedButton from './AnimatedButton'

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)

export default function UploadZone({
  onFileSelect,
  selectedFile = null,
  onClear,
  actionButton = null,
  isLoading = false,
}) {
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    noClick: !!selectedFile,
    noKeyboard: !!selectedFile,
    disabled: isLoading,
  })

  return (
    <MotionPaper
      elevation={0}
      {...getRootProps()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!selectedFile ? { y: -2, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      sx={{
        p: { xs: 3, md: 6 },
        borderRadius: 4,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        bgcolor: isDragActive ? 'rgba(17, 24, 39, 0.02)' : 'background.paper',
        textAlign: 'center',
        cursor: selectedFile ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
      }}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <MotionBox
            key="upload-prompt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <MotionBox
              animate={isDragActive ? { y: [0, -10, 0] } : { y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: isDragActive ? 1.5 : 3, ease: 'easeInOut' }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: isDragActive ? '#111827' : 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                color: isDragActive ? '#fff' : 'text.primary',
                boxShadow: isDragActive ? '0 10px 25px -5px rgba(17,24,39,0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <Camera size={28} />
            </MotionBox>

            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              {isDragActive ? 'Drop image to analyze' : 'Upload an image'}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 300 }}>
              Drag and drop an image file here, or{' '}
              <Typography
                component="span"
                variant="body1"
                color="primary.main"
                fontWeight={600}
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={open}
              >
                browse files
              </Typography>
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, opacity: 0.6 }}>
              {['JPEG', 'PNG', 'WEBP'].map(ext => (
                <Typography key={ext} variant="caption" sx={{ px: 1, py: 0.5, bgcolor: 'divider', borderRadius: 1, fontWeight: 600 }}>
                  {ext}
                </Typography>
              ))}
            </Box>
          </MotionBox>
        ) : (
          <MotionBox
            key="upload-preview"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {onClear && !isLoading && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' },
                  zIndex: 10,
                }}
              >
                <X size={16} />
              </IconButton>
            )}

            <Box
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              sx={{
                width: { xs: 200, md: 280 },
                height: { xs: 200, md: 280 },
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
              }}
            >
              {previewUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={previewUrl}
                  alt="Upload preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <FileImage size={48} color="#9CA3AF" />
              )}
            </Box>

            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: '80%', mb: 0.5, letterSpacing: '-0.01em' }}>
              {selectedFile.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
              {formatBytes(selectedFile.size)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {actionButton}
              {!isLoading && (
                <AnimatedButton
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    open()
                  }}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Change Image
                </AnimatedButton>
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionPaper>
  )
}
