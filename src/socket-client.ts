import { Manager, Socket } from 'socket.io-client'

export const connectToServer = () => {

  const manager = new Manager(import.meta.env.VITE_WS_SERVER)

  const socket = manager.socket('/')

  addListeners(socket)

  return socket
}

const addListeners = (socket: Socket) => {

  const serverStatusLabel =
    document.querySelector<HTMLDivElement>('#server-status')

  const clientsUl =
    document.querySelector<HTMLUListElement>('#clients-ul')!

  const messageForm =
    document.querySelector<HTMLFormElement>('#message-form')!

  const messageInput =
    document.querySelector<HTMLInputElement>('#message-input')!

  socket.on('connect', () => {

    console.log('CONNECTED')
    console.log('Socket ID:', socket.id)
    console.log('Connected:', socket.connected)

    if (serverStatusLabel) {
      serverStatusLabel.innerHTML = 'Connected'
    }
  })

  socket.on('disconnect', (reason) => {

    console.log('DISCONNECTED')
    console.log('Reason:', reason)

    if (serverStatusLabel) {
      serverStatusLabel.innerHTML = 'Disconnected'
    }
  })

  socket.on('clients-updated', (clients: string[]) => {

    console.log('CLIENTS:', clients)

    let clientsHtml = ''

    clients.forEach(clientId => {

      clientsHtml += `
        <li>${clientId}</li>
      `
    })

    clientsUl.innerHTML = clientsHtml
  })

  messageForm.addEventListener('submit', (event) => {

    event.preventDefault()

    const message = messageInput.value.trim()

    if (!message) {
      return
    }

    console.log('SENDING MESSAGE')
    console.log('Socket connected:', socket.connected)
    console.log('Socket ID:', socket.id)
    console.log('Message:', message)

    socket.emit(
      'message-from-client',
      {
        id: 'YO',
        message,
      },
      (response) => {

        console.log('SERVER ACK:', response)

      },
    )

    messageInput.value = ''
  })
}