import React, { useState } from 'react'
import { Box, Container, Typography, Tabs, Tab, Divider } from '@mui/material'
import { Shield, Eye, Lock } from 'lucide-react'
import InspectImageTab from './components/InspectImageTab'
import PrivacyCleanerTab from './components/PrivacyCleanerTab'

function App() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="header"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1.75,
          px: { xs: 3, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
            ProofLens
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: { xs: 'none', sm: 'block' } }}>
          Image Provenance & Privacy Suite
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Typography
            variant="h3"
            component="h1"
            color="text.primary"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              mb: 2,
              fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.875rem' },
            }}
          >
            Inspect image provenance.
            <br />
            Protect your privacy.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 580,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.0625rem' },
              lineHeight: 1.6,
            }}
          >
            Analyze image metadata and remove personal metadata before sharing online.
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            aria-label="ProofLens Workspace Tabs"
          >
            <Tab
              icon={<Eye size={16} />}
              iconPosition="start"
              label="Inspect Image"
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              icon={<Lock size={16} />}
              iconPosition="start"
              label="Privacy Cleaner"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
          </Tabs>
        </Box>
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
          sx={{ width: '100%' }}
        >
          {activeTab === 0 && <InspectImageTab />}
        </Box>
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
          sx={{ width: '100%' }}
        >
          {activeTab === 1 && <PrivacyCleanerTab />}
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          ProofLens • Built with FastAPI • React • Material UI
        </Typography>
      </Box>
    </Box>
  )
}

export default App
