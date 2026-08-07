import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import WorkspacePage from './pages/WorkspacePage'
import PrivacyCleanerPage from './pages/PrivacyCleanerPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/privacy-cleaner" element={<PrivacyCleanerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
