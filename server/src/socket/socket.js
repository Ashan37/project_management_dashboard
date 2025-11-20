io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("taskStatusChange", (data) => {
    io.emit("refreshKanban", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
