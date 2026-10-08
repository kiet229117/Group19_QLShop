const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
).replace(/\/+$/, '')

async function postAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()
  let data = responseText

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      if (response.ok) {
        throw new Error('API trả về dữ liệu không phải JSON hợp lệ.')
      }
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && typeof data.message === 'string'
        ? data.message
        : typeof data === 'string' && data
          ? data
          : `Yêu cầu thất bại (${response.status}).`

    throw new Error(message)
  }

  return data
}

export function login({ usernameOrEmail, password }) {
  return postAuth('login', { usernameOrEmail, password })
}

export function register({ username, email, password, fullname, phone }) {
  return postAuth('register', { username, email, password, fullname, phone })
}
