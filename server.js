const express = require("express");
const app = express();
app.use(express.static("public"));
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port", server.address().port);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("New user connected");
});

const fs = require("fs");

io.on("connection", (socket) => {
  socket.on("join", (IdAndPass) => {
    fs.readFile("userinfo.txt", "utf8", (err, userinfo) => {
      if (err) throw err;

      const users = JSON.parse(userinfo);

      const isDuplicate = users.some((user) => user.id === IdAndPass.id);

      if (isDuplicate) {
        socket.emit("join_fail", "중복된 아이디");
        console.log("중복된 아이디 : ", IdAndPass.id);
      } else {
        users.push(IdAndPass);

        const updatedUserinfo = JSON.stringify(users);

        fs.writeFile("userinfo.txt", updatedUserinfo, "utf8", (err) => {
          if (err) throw err;

          socket.emit("join_success", "가입 성공");
          console.log(
            "가입 성공 : ",
            IdAndPass.id,
            "비번 : ",
            IdAndPass.password
          );
        });
      }
    });
  });
});

io.on("connection", (socket) => {
  socket.on("login", (IdAndPass) => {
    fs.readFile("userinfo.txt", "utf8", (err, userinfo) => {
      if (err) throw err;

      const users = JSON.parse(userinfo);

      const isValidUser = users.some(
        (user) =>
          user.id === IdAndPass.id && user.password === IdAndPass.password
      );

      if (isValidUser) {
        socket.emit("login_success", IdAndPass.id);
        console.log("로그인 성공 : ", IdAndPass.id);
      } else {
        socket.emit("login_fail", "로그인 실패 : ", IdAndPass.id);
        console.log("로그인 실패");
      }
    });
  });
});

const connectedClients = {};
io.on("connection", (socket) => {
  socket.on("loginS", (data) => {
    const clientId = data;
    
    connectedClients[clientId] = socket;
  });

  socket.on("disconnect", () => {
    // 클라이언트 연결 해제 시 연결된 소켓 삭제
    const clientId = getClientIdBySocket(socket);
    delete connectedClients[clientId];
    console.log(`클라이언트 연결 해제: ${clientId}`);
  });
});

// 소켓으로부터 클라이언트 ID를 찾아 반환하는 함수
function getClientIdBySocket(socket) {
  const entries = Object.entries(connectedClients);
  for (const [clientId, clientSocket] of entries) {
    if (clientSocket === socket) {
      return clientId;
    }
  }
  return null;
}
