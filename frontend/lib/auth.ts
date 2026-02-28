export function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('accessToken') || ''
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
}
