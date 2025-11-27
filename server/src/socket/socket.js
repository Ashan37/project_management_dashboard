io.on("connection", (socket) => {
  socket.on("taskStatusChange", (data) => {
    io.emit("refreshKanban", data);
  });

  socket.on("disconnect", () => {
    // Client disconnected
  });
});
