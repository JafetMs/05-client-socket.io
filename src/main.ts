import './style.css'
import { connectToServer } from './socket-client'

// connectToServer()

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!
const authForm = document.querySelector<HTMLFormElement>('#auth-form')!

authForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const token = jwtToken.value.trim()
  if (!token) {
    alert('Enter a valid JWT')
    return
  }

  connectToServer(token)
})
