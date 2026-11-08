import { Manager, Socket } from 'socket.io-client'

interface ServerMessage {
  senderId: string
  fullName?: string
  message: string
}

let socket: Socket | undefined;

export const connectToServer = (token: string) => {
  socket?.removeAllListeners()
  socket?.disconnect()

  const manager = new Manager(import.meta.env.VITE_WS_SERVER, {
    extraHeaders: {
      authentication: token,
    },
  })

  socket = manager.socket('/')
  addListeners(socket)
}

const addListeners = (socket: Socket) => {
  const statusLabel = document.querySelector<HTMLSpanElement>('#server-status-label')!
  const connectionPill = document.querySelector<HTMLSpanElement>('#connection-pill-label')!
  const overviewStatus = document.querySelector<HTMLElement>('#overview-status')!
  const serverCardStatus = document.querySelector<HTMLElement>('#server-card-status')!
  const serverAddress = document.querySelector<HTMLElement>('#server-address')!
  const serverCardAddress = document.querySelector<HTMLElement>('#server-card-address')!
  const reconnectButton = document.querySelector<HTMLButtonElement>('#reconnect-button')!
  const clientsList = document.querySelector<HTMLUListElement>('#clients-ul')!
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!
  const response = document.querySelector<HTMLElement>('#server-response')!
  const emptyState = document.querySelector<HTMLElement>('#chat-empty-state')!
  const chatMessages = document.querySelector<HTMLOListElement>('#chat-messages')!
  const messageCount = document.querySelector<HTMLElement>('#message-count')!
  const overviewMessageCount = document.querySelector<HTMLElement>('#overview-message-count')!

  const endpoint = import.meta.env.VITE_WS_SERVER || 'Not configured'
  serverAddress.textContent = endpoint
  serverCardAddress.textContent = endpoint

  let receivedMessages = 0

  const setConnectionStatus = (connected: boolean) => {
    const label = connected ? 'Connected' : 'Disconnected'
    statusLabel.textContent = connected ? 'Connected · ' + socket.id : label
    connectionPill.textContent = label
    overviewStatus.textContent = label
    serverCardStatus.textContent = connected ? 'Live connection established' : 'Waiting for connection'
  }

  const renderMessage = (message: ServerMessage) => {
    const isOwnMessage = message.senderId === socket.id

    emptyState.hidden = true
    chatMessages.hidden = false

    const item = document.createElement('li')
    item.className = 'chat-message ' + (isOwnMessage ? 'is-own' : 'is-other')

    const sender = document.createElement('span')
    sender.className = 'chat-message-name'
    sender.textContent = isOwnMessage ? 'You' : (message.fullName || 'Other client')

    const text = document.createElement('p')
    text.className = 'chat-message-text'
    text.textContent = message.message

    const time = document.createElement('time')
    time.className = 'chat-message-time'
    time.dateTime = new Date().toISOString()
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    item.append(sender, text, time)
    chatMessages.append(item)
    chatMessages.scrollTop = chatMessages.scrollHeight

    receivedMessages += 1
    messageCount.textContent = receivedMessages + (receivedMessages === 1 ? ' message' : ' messages')
    overviewMessageCount.textContent = String(receivedMessages)
  }

  socket.on('connect', () => {
    setConnectionStatus(true)
    console.log('CONNECTED:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    setConnectionStatus(false)
    console.log('DISCONNECTED:', reason)
  })

  socket.on('connect_error', (error) => {
    response.textContent = 'Connection error: ' + error.message
    console.error('CONNECTION ERROR:', error)
  })

  socket.on('exception', (error) => {
    response.textContent = 'Server exception: ' + JSON.stringify(error)
    console.error('SERVER EXCEPTION:', error)
  })

  socket.on('clients-updated', (clients: string[]) => {
    clientsList.replaceChildren(
      ...clients.map((clientId) => {
        const item = document.createElement('li')
        item.textContent = clientId
        return item
      }),
    )
  })

  socket.on('message-from-server', (message: ServerMessage) => {
    if (!message || typeof message.senderId !== 'string' || typeof message.message !== 'string') return
    renderMessage(message)
  })

  reconnectButton.addEventListener('click', () => {
    if (!socket.connected) socket.connect()
  })

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const message = messageInput.value.trim()
    if (!message) return

    if (!socket.connected) {
      response.textContent = 'Connect to the server before sending a message.'
      return
    }

    socket.emit('message-from-client', { message }, (acknowledgement: unknown) => {
      console.log('SERVER ACK:', acknowledgement)
    })

    messageInput.value = ''
    messageInput.focus()
  })
}
