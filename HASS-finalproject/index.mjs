import express from 'express';
import http from 'http';
import path from 'path';

import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';

import { analysis_by_topic, analysis_by_user } from './js/twitter_api.mjs';

// Getting the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 

const app = express();

// Create a httpServer through Express
const httpServer = http.createServer(app); 

// Attach Socket.IO to HTTP server
const io = new SocketIOServer(httpServer); 



app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



io.on('connection', socket => {
  console.log('Client connected');
  
  socket.on('analysis_by_topic', (keywords) => {
    console.log('Analysis by topic search click event received');
    analysis_by_topic(socket, keywords);
  });

  socket.on('analysis_by_user', (username) => {
    console.log('Analysis by user search click event received');
    analysis_by_user(socket, username);
  });
});

const server = httpServer.listen(process.env.PORT || 8080, () => {
  const address = server.address();
  console.log(`Server is running on ${address.address}:${address.port}`);
});