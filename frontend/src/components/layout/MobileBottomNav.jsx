import React from 'react'
import { Box, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, SprayCan } from 'lucide-react'
import { colors, spacing } from '../../utils/tokens'

const ITEMS = [
  { label: 'Home', to: '/', icon: <Home size={20} /> },
  { label: 'Workspace', to: '/workspace', icon: <LayoutDashboard size={20} /> },
  { label: 'Privacy Cleaner', to: '/privacy-cleaner', icon: <SprayCan size={20} /> },
]

/**
 * Mobile bottom navigation (Stitch: md:hidden bottom nav bar).
 */
export default function MobileBottomNav() {
  return (
    <Box
      component="nav"
      aria-label="Mobile navigation"
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 64,
        bgcolor: 'rgba(5, 8, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(145, 94, 255, 0.18)',
        justifyContent: 'space-around',
        alignItems: 'center',
        px: spacing.sm,
        zIndex: 30,
      }}
    >
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            textDecoration: 'none',
            color: isActive ? colors.primary : colors.onSurfaceVariant,
          })}
        >
          {item.icon}
          <Typography sx={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</Typography>
        </NavLink>
      ))}
    </Box>
  )
}
