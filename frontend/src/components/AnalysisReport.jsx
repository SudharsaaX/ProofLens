import React from 'react'
import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import SummaryCard from './SummaryCard'
import MetadataChecklist from './MetadataChecklist'
import FileInfoSection from './FileInfoSection'
import CameraInfoCard from './CameraInfoCard'
import AiEditingCard from './AiEditingCard'
import C2PASection from './C2PASection'
import DeveloperTools from './DeveloperTools'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function AnalysisReport({ analysis }) {
  if (!analysis) return null

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SummaryCard analysis={analysis} />
      <MetadataChecklist analysis={analysis} />
      <FileInfoSection fileInfo={analysis.file_info} />
      <CameraInfoCard cameraInfo={analysis.camera_information} />
      <AiEditingCard
        generatorInfo={analysis.generator_metadata}
        software={analysis.software_detected}
      />
      <C2PASection c2pa={analysis.c2pa} />
      <DeveloperTools analysis={analysis} />
    </Box>
  )
}
