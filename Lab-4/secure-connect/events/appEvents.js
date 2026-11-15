const EventEmitter = require('events');

const appEvents = new EventEmitter();

appEvents.on('userRegistered', (user) => {
  console.log(`[event] New user registered: ${user.username} (${user.email})`);
});

appEvents.on('userLoggedIn', (user) => {
  console.log(`[event] User logged in: ${user.username}`);
});

appEvents.on('noteCreated', (note) => {
  console.log(`[event] Note created: "${note.title}" by owner ${note.owner}`);
});

module.exports = appEvents;