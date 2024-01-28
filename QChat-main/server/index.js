const express = require("express");
const app = express();
const port = 3001;
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //url for frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket)=>{
  console.log("User Connected: ", socket.id);

  socket.on("chat_message", (data)=>{
    console.log(data.message);
    socket.broadcast.emit("recieve_message", {message: data.message});
  })
})
 
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
