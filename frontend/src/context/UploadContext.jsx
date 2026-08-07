import React, { createContext, useContext, useState } from 'react'

const UploadContext = createContext(null)

/**
 * Shares the currently-selected image file across routes
 * (Landing -> Workspace -> Privacy Cleaner) so the user's upload
 * survives navigation without re-selecting.
 */
export function UploadProvider({ children }) {
  const [file, setFile] = useState(null)
  return (
    <UploadContext.Provider value={{ file, setFile }}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  return useContext(UploadContext)
}
