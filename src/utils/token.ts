const getPayload = (jwt: string): any => {
  // El token se divide en 3 partes separadas por '.'
  // La segunda parte es un base64 codificado JSON

  // Con esta función extraemos esa segunda parte
  return atob(jwt.split('.')[1])
}

const isTokenExpired = (jwt: string): boolean => {
  const payload = getPayload(jwt)
  const expiration = new Date(payload.exp)
  const now = new Date()

  const oneWeek = 1000 * 60 * 60 * 24 * 7

  return expiration.getTime() - now.getTime() < oneWeek
}
