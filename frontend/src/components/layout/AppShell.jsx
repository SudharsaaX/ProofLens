import React from 'react'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { UploadCloud, SprayCan } from 'lucide-react'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'
import MobileBottomNav from './MobileBottomNav'
import AppFooter from '../ui/AppFooter'
import { colors } from '../../utils/tokens'

const HEADER_MAP = {
  '/workspace': { icon: <UploadCloud size={20} color={colors.primary} />, title: 'Analysis Workspace' },
  '/privacy-cleaner': { icon: <SprayCan size={20} color={colors.primary} />, title: 'Privacy Cleaner' },
}

/**
 * Application shell for the tool screens (Workspace / Privacy Cleaner).
 * Matches the Stitch Analysis Workspace layout: sidebar + contextual header
 * + scrollable canvas + footer, with a mobile bottom nav.
 */
export default function AppShell({ children, footer = true }) {
  const { pathname } = useLocation()
  const header = HEADER_MAP[pathname] || { icon: null, title: 'ProofLens' }

  return (
    <Box sx={{ display: 'flex', height: { xs: '100dvh', md: '100vh' }, width: '100%', overflow: 'hidden', bgcolor: colors.background, position: 'relative' }}>
      <Box className="ambient-glow" />

      <AppSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <AppHeader icon={header.icon} title={header.title} />

        <Box className="custom-scrollbar" sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%', maxWidth: '1280px', mx: 'auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {children}
          </Box>
          {footer && (
            <Box sx={{ width: '100%', maxWidth: '1280px', mx: 'auto', mt: 'auto', pb: { xs: 8, md: 1.5 }, pt: 2 }}>
              <AppFooter variant="inline" />
            </Box>
          )}
        </Box>
      </Box>

      <MobileBottomNav />
    </Box>
  )
}
