import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, IconButton, Typography } from '@mui/material'
import { Upload, X, FileImage } from 'lucide-react'
import { formatBytes } from '../utils/formatters'
import { motion, AnimatePresence } from 'framer-motion'
import GhostButton from './ui/GhostButton'
import { colors, radius, typography } from '../utils/tokens'

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
      'image/tiff': ['.tiff', '.tif'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxFiles: 1,
    noClick: !!selectedFile,
    noKeyboard: !!selectedFile,
    disabled: isLoading,
  })

  return (
    <Box
      className={`animated-border-wrap ${isDragActive ? 'dragover' : ''}`}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        {...getRootProps()}
        className="animated-border-content"
        sx={{
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          cursor: selectedFile ? 'default' : 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDragActive ? 'rgba(173, 198, 255, 0.08)' : 'rgba(18, 18, 18, 0.85)',
          transition: 'background-color 0.3s ease',
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
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}
          >
            <MotionBox
              animate={isDragActive ? { y: [0, -8, 0] } : { y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: isDragActive ? 1.2 : 3, ease: 'easeInOut' }}
              sx={{
                width: 56,
                height: 56,
                borderRadius: radius.md,
                bgcolor: isDragActive ? 'rgba(173, 198, 255, 0.15)' : colors.surfaceContainerLow,
                border: '1px solid',
                borderColor: isDragActive ? 'rgba(173, 198, 255, 0.3)' : colors.outlineVariant,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                color: isDragActive ? colors.primary : colors.outline,
                transition: 'all 0.3s ease',
              }}
            >
              <Upload size={24} />
            </MotionBox>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: colors.onSurface,
                fontSize: '1rem',
                letterSpacing: '-0.01em',
              }}
            >
              {isDragActive ? 'Drop image to analyze' : 'Upload an image'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.onSurfaceVariant,
                mb: 3,
                maxWidth: 320,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
              }}
            >
              Drag and drop an image file here, or{' '}
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation()
                  open()
                }}
                sx={{
                  color: colors.primary,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                browse files
              </Box>
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['JPEG', 'PNG', 'WebP', 'TIFF', 'HEIC'].map((ext) => (
                <Box
                  key={ext}
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: colors.surfaceContainerLow,
                    border: `1px solid ${colors.outlineVariant}`,
                    borderRadius: radius.sm,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: colors.outline,
                    letterSpacing: '0.05em',
                    lineHeight: 1.5,
                  }}
                >
                  {ext}
                </Box>
              ))}
            </Box>
          </MotionBox>
        ) : (
          <MotionBox
            key="upload-preview"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            sx={{ py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
                  top: 12,
                  right: 12,
                  border: `1px solid ${colors.outlineVariant}`,
                  bgcolor: 'rgba(19, 19, 19, 0.8)',
                  color: colors.onSurfaceVariant,
                  width: 28,
                  height: 28,
                  '&:hover': { bgcolor: colors.surfaceContainerHigh, color: colors.onSurface },
                  zIndex: 10,
                }}
              >
                <X size={14} />
              </IconButton>
            )}

            <Box
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              sx={{
                width: { xs: 180, md: 240 },
                height: { xs: 180, md: 240 },
                borderRadius: radius.md,
                overflow: 'hidden',
                border: `1px solid ${colors.outlineVariant}`,
                bgcolor: colors.surfaceContainerLowest,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
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
                <FileImage size={40} color={colors.outline} />
              )}
            </Box>

            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                maxWidth: '80%',
                mb: 0.5,
                color: colors.onSurface,
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {selectedFile.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: colors.onSurfaceVariant,
                mb: 3,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
              }}
            >
              {formatBytes(selectedFile.size)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {actionButton}
              {!isLoading && (
                <GhostButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    open()
                  }}
                  sx={{
                    borderRadius: radius.default,
                    px: 2.5,
                    py: 0.75,
                    fontSize: '0.8125rem',
                    color: colors.onSurfaceVariant,
                  }}
                >
                  Change Image
                </GhostButton>
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
      </Box>
    </Box>
  )
}
