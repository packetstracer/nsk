var socket = io();

var messageListEl = document.querySelector('ul#messages');
var submitEl      = document.querySelector('input#send-button');
var messageEl     = document.querySelector('input#message');

socket.on('socket-test:message-received', function (ev) {
  var messageItemEl = document.createElement('li');

  messageItemEl.innerHTML = ev.message;
  messageListEl.appendChild(messageItemEl);
  messageListEl.scrollTop = messageListEl.scrollHeight;
});


submitEl.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (!messageEl.value) {
    return false;
  }

  console.log('Socket message sent to server: ' + messageEl.value);
  socket.emit('socket-test:message-sent', { message: messageEl.value });
  messageEl.value = '';
});