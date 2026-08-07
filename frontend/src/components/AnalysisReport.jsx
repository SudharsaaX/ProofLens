import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Image as ImageIcon, SprayCan, UploadCloud, RotateCcw } from 'lucide-react'
import SummaryCard from './SummaryCard'
import MetadataChecklist from './MetadataChecklist'
import FileInfoSection from './FileInfoSection'
import CameraInfoCard from './CameraInfoCard'
import AiEditingCard from './AiEditingCard'
import C2PASection from './C2PASection'
import DeveloperTools from './DeveloperTools'
import PrimaryButton from './ui/PrimaryButton'
import GhostButton from './ui/GhostButton'
import { colors, radius, typography } from '../utils/tokens'

function AnalyzedImageCard({ file, previewUrl, onReset }) {
  const format = file?.type?.split('/')[1]?.toUpperCase() || 'IMAGE'
  const sizeMb = file?.size ? (file.size / (1024 * 1024)).toFixed(1) : null

  return (
    <Box
      className="glass-panel"
      sx={{
        borderRadius: radius.md,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top Left: Inspect Another Image button */}
      {onReset && (
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <GhostButton
            onClick={onReset}
            startIcon={<UploadCloud size={14} />}
            sx={{
              bgcolor: 'rgba(21, 16, 48, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(145, 94, 255, 0.4)',
              color: colors.primary,
              fontSize: '12px',
              fontWeight: 600,
              py: 0.5,
              px: 1.5,
              '&:hover': {
                bgcolor: colors.surfaceContainerHigh,
                borderColor: colors.primary,
              },
            }}
          >
            Inspect Another Image
          </GhostButton>
        </Box>
      )}

      {/* Chips */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 1 }}>
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: radius.sm,
            bgcolor: 'rgba(19, 19, 19, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(66, 71, 84, 0.3)',
            color: colors.onSurface,
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <ImageIcon size={14} /> {format}
        </Box>
        {sizeMb && (
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: radius.sm,
              bgcolor: 'rgba(19, 19, 19, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(66, 71, 84, 0.3)',
              color: colors.onSurface,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {sizeMb} MB
          </Box>
        )}
      </Box>

      {/* Subject image with reticle overlay */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 280, md: 380 },
          width: '100%',
          bgcolor: '#0a0a0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {previewUrl ? (
          <>
            <Box
              component="img"
              src={previewUrl}
              alt=""
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(24px) opacity(0.25)',
                transform: 'scale(1.15)',
                pointerEvents: 'none',
              }}
            />
            <Box
              component="img"
              src={previewUrl}
              alt="Analyzed subject"
              sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={48} color={colors.outlineVariant} />
          </Box>
        )}
        <Box
          className="group-reticle"
          sx={{
            position: 'absolute',
            inset: 16,
            border: '1px solid rgba(173, 198, 255, 0.2)',
            pointerEvents: 'none',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: 16,
              height: 16,
              borderColor: colors.primary,
            },
            '&::before': { top: -1, left: -1, borderTop: '2px solid', borderLeft: '2px solid' },
            '&::after': { bottom: -1, right: -1, borderBottom: '2px solid', borderRight: '2px solid' },
          }}
        >
          <Box sx={{ position: 'absolute', top: -1, right: -1, width: 16, height: 16, borderTop: '2px solid', borderRight: '2px solid', borderColor: colors.primary }} />
          <Box sx={{ position: 'absolute', bottom: -1, left: -1, width: 16, height: 16, borderBottom: '2px solid', borderLeft: '2px solid', borderColor: colors.primary }} />
        </Box>
      </Box>
    </Box>
  )
}

export default function AnalysisReport({ analysis, previewUrl = null, file = null, onClear = null, onReset = null }) {
  if (!analysis) return null

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <SummaryCard analysis={analysis} />

      <Grid container spacing={2}>
        {/* Left Column: Image preview + Forensic Detail Cards */}
        <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnalyzedImageCard file={file} previewUrl={previewUrl} onReset={onReset} />
          <C2PASection c2pa={analysis.c2pa} />
          <AiEditingCard
            generatorInfo={analysis.generator_metadata}
            software={analysis.software_detected}
          />
          <CameraInfoCard cameraInfo={analysis.camera_information} />
        </Grid>

        {/* Right Column: Technical Metadata Sidebar */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FileInfoSection fileInfo={analysis.file_info} />
          <MetadataChecklist analysis={analysis} />
        </Grid>
      </Grid>

      {/* Action Banner (Privacy Cleaner & Inspect Another Image) */}
      {(onClear || onReset) && (
        <Box
          className="glass-panel"
          sx={{
            borderRadius: radius.md,
            p: 2,
            mt: 1,
            background: 'linear-gradient(135deg, #1d1836 0%, #100d25 100%)',
            borderTop: '2px solid rgba(145, 94, 255, 0.4)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1,
              bgcolor: 'rgba(145, 94, 255, 0.15)',
              color: colors.primary,
              borderRadius: radius.default,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={24} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: colors.onSurface }}>
              Analysis Complete
            </Typography>
            <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant }}>
              Inspect another digital asset or open Privacy Cleaner to sanitize metadata before sharing.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {onReset && (
              <GhostButton
                onClick={onReset}
                startIcon={<UploadCloud size={16} />}
                sx={{
                  whiteSpace: 'nowrap',
                  border: `1px solid ${colors.outlineVariant}60`,
                  '&:hover': { borderColor: colors.primary, color: colors.primary },
                }}
              >
                Inspect Another Image
              </GhostButton>
            )}
            {onClear && (
              <PrimaryButton
                variant="pill"
                onClick={onClear}
                startIcon={<SprayCan size={16} />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Open Privacy Cleaner
              </PrimaryButton>
            )}
          </Box>
        </Box>
      )}

      <DeveloperTools analysis={analysis} />
    </Box>
  )
}
