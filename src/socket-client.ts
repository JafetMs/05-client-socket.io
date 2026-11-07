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

  const clientsUl = document.querySelector('#clients-ul')!

  socket.on('connect', () => {
    console.log('Connected:', socket.id)

    if (serverStatusLabel) {
      serverStatusLabel.innerHTML = 'Connected'
    }
  })

  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason)

    if (serverStatusLabel) {
      serverStatusLabel.innerHTML = 'Disconnected'
    }
  })

  socket.on('clients-updated',(clients : string[]) =>{
    console.log({clients})
    let clientsHtml  = '';
    clients.forEach( clientId => {
        clientsHtml+= `
            <li>${clientId}</li>
        `
    });
    clientsUl.innerHTML = clientsHtml
  })
}