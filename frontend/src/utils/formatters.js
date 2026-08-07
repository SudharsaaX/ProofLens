export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return String(dateString)
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return String(dateString)
  }
}

export function truncateHash(hash, length = 16) {
  if (!hash) return ''
  if (hash.length <= length * 2) return hash
  return `${hash.slice(0, length)}...${hash.slice(-4)}`
}
