const socket = io()
const nskSocket = io('/nsk')

let messageListEl = document.querySelector('ul#messages')
let broadcastMessagesListEl = document.querySelector('ul#broadcast-messages')
let namespaceMessagesListEl = document.querySelector('ul#namespace-messages')
let roomMessagesListEl = document.querySelector('ul#room-messages')

let messageEl = document.querySelector('input#message')

const submitEl = document.querySelector('input#send-button')
const broadcastEl = document.querySelector('input#broadcast-button')
const namespaceEl = document.querySelector('input#namespace-button')
const roomEl = document.querySelector('input#room-button')

const roomName = 'nsk-room'


// socket messages listeners
socket.on('socket-test:message-received', function (ev) {
  let messageItemEl = document.createElement('li')

  messageItemEl.innerHTML = ev.message
  messageListEl.appendChild(messageItemEl)
  messageListEl.scrollTop = broadcastMessagesListEl.scrollHeight
})

socket.on('socket-test:message-broadcasted', function (ev) {
  let messageItemEl = document.createElement('li')

  messageItemEl.innerHTML = ev.message
  broadcastMessagesListEl.appendChild(messageItemEl)
  broadcastMessagesListEl.scrollTop = messageListEl.scrollHeight
})

nskSocket.on('socket-nsk:namespace-message-received', function (ev) {
  let messageItemEl = document.createElement('li')

  messageItemEl.innerHTML = ev.message
  namespaceMessagesListEl.appendChild(messageItemEl)
  namespaceMessagesListEl.scrollTop = messageListEl.scrollHeight
})

socket.on('socket-nsk2:room-message-received', function (ev) {
  let messageItemEl = document.createElement('li')

  messageItemEl.innerHTML = ev.message
  roomMessagesListEl.appendChild(messageItemEl)
  roomMessagesListEl.scrollTop = messageListEl.scrollHeight
})


// buttons listeners
submitEl.addEventListener('click', function (e) {
  e.preventDefault()

  if (!messageEl.value) {
    return false
  }

  console.log('Socket message sent to server: ' + messageEl.value)
  socket.emit('socket-test:message-sent', {message: messageEl.value})
  messageEl.value = ''
})

broadcastEl.addEventListener('click', function (e) {
  e.preventDefault()

  if (!messageEl.value) {
    return false
  }

  console.log('Socket message sent to server for broadcasting: ' + messageEl.value)
  socket.emit('socket-test:message-broadcasted', {message: messageEl.value})
  messageEl.value = ''
})

namespaceEl.addEventListener('click', function (e) {
  e.preventDefault()

  if (!messageEl.value) {
    return false
  }

  console.log('Socket message sent to namespace: ' + messageEl.value)
  nskSocket.emit('socket-nsk:namespace-message-sent', {message: messageEl.value})
  messageEl.value = ''
})

roomEl.addEventListener('click', function (e) {
  e.preventDefault()

  if (!messageEl.value) {
    return false
  }

  console.log('Socket message sent to room: ' + messageEl.value)
  socket.emit('socket-nsk2:room-message-sent', {message: messageEl.value}, roomName)
  messageEl.value = ''
})
