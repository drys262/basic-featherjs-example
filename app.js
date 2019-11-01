const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// idea service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    console.log('CREATE IDEA HERE');
    console.log(data);
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer,
      time: moment().format('h:mm:ss a')
    };
    this.ideas.push(idea);
    return idea;
  }
}

const app = express(feathers());

// parse json
app.use(express.json());
// config socket.io realtime api's
app.configure(socketio());
// enable rest services
app.configure(express.rest());
// register services
app.use('/ideas', new IdeaService());

app.use(express.static('public'));

// new connections connect to stream channel
app.on('connection', connection => app.channel('stream').join(connection));
// publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on('listening', () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

// create new idea
app.service('ideas').create({
  text: 'Sample Text',
  tech: 'Sample tech',
  viewer: 'DK'
});
