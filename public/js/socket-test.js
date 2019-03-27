const socket = io()

let messageListEl = document.querySelector('ul#messages')
let broadcastMessagesListEl = document.querySelector('ul#broadcast-messages')
let messageEl = document.querySelector('input#message')
const submitEl = document.querySelector('input#send-button')
const broadcastEl = document.querySelector('input#broadcast-button')

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
