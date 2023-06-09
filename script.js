var userID = "guest";

window.addEventListener("scroll", function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);
});

const socket = io();
window.addEventListener("DOMContentLoaded", function () {
  var loginIdInput = document.querySelector(".login_id");
  var joinIdInput = document.querySelector(".join_id");

  // login_id 입력 필드에서 한글과 공백 입력 방지
  loginIdInput.addEventListener("input", function () {
    var inputValue = loginIdInput.value;
    var filteredValue = inputValue.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "");
    loginIdInput.value = filteredValue;
  });

  // join_id 입력 필드에서 한글과 공백 입력 방지
  joinIdInput.addEventListener("input", function () {
    var inputValue = joinIdInput.value;
    var filteredValue = inputValue.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "");
    joinIdInput.value = filteredValue;
  });
});

window.addEventListener("DOMContentLoaded", function () {
  var joinPassInput = document.querySelector(".join_pass");
  var joinPassRepeatInput = document.querySelector(".join_pass_repeat");
  var joinBtn = document.querySelector(".joinbtn");

  // join_pass 입력 필드에서 공백 입력 방지
  joinPassInput.addEventListener("input", function () {
    var inputValue = joinPassInput.value;
    var filteredValue = inputValue.replace(/\s/g, "");
    joinPassInput.value = filteredValue;
  });

  // join_pass_repeat 입력 필드에서 공백 입력 방지
  joinPassRepeatInput.addEventListener("input", function () {
    var inputValue = joinPassRepeatInput.value;
    var filteredValue = inputValue.replace(/\s/g, "");
    joinPassRepeatInput.value = filteredValue;
  });

  // join_pass_repeat 입력 필드 값 비교
  joinPassRepeatInput.addEventListener("input", function () {
    var passValue = joinPassInput.value;
    var repeatValue = joinPassRepeatInput.value;

    if (passValue !== repeatValue) {
      joinPassRepeatInput.classList.add("red-border");
      joinBtn.disabled = true; // 비활성화
    } else {
      joinPassRepeatInput.classList.remove("red-border");
      joinBtn.disabled = false; // 활성화
    }
  });
});

window.addEventListener("DOMContentLoaded", function () {
  var joinBtn = document.querySelector(".joinbtn");

  // joinbtn 버튼 클릭 이벤트 핸들러
  joinBtn.addEventListener("click", function () {
    if (
      document.querySelector(".join_id").value != "" &&
      document.querySelector(".join_pass").value != "" &&
      document.querySelector(".join_pass").value ==
        document.querySelector(".join_pass_repeat").value
    ) {
      var joinIdInput = document.querySelector(".join_id");
      var joinPassInput = document.querySelector(".join_pass");
      var idValue = joinIdInput.value;
      var passValue = joinPassInput.value;

      // 아이디와 비밀번호를 JSON 형식으로 저장
      var data = {
        id: idValue,
        password: passValue,
      };

      // Socket.IO를 사용하여 백엔드 서버로 데이터 전송
      socket.emit("join", data);
    } else {
      alert("아이디 또는 비밀번호를 입력해주세요");
    }
  });
});

socket.on("join_fail", (txt) => {
  alert("사용할 수 없는 아이디입니다.");
});

socket.on("join_success", (txt) => {
  alert("회원가입이 완료되었습니다.");
});

function lg() {
  var joinIdInput = document.querySelector(".login_id");
  var joinPassInput = document.querySelector(".login_pass");
  var idValue = joinIdInput.value;
  var passValue = joinPassInput.value;

  // 아이디와 비밀번호를 JSON 형식으로 저장
  var data = {
    id: idValue,
    password: passValue,
  };

  // Socket.IO를 사용하여 백엔드 서버로 데이터 전송
  socket.emit("login", data);
}

window.addEventListener("DOMContentLoaded", function () {
  var loginbtn = document.querySelector(".loginbtn");
  loginbtn.addEventListener("click", function () {
    lg();
  });
});

socket.on("login_fail", (txt) => {
  alert("아이디 또는 비밀번호가 일치하지 않습니다.");
});

socket.on("login_success", (id) => {
  alert("로그인 성공: " + id);
  socket.emit("loginS", id);
  var wrap1 = document.getElementById("wrap1");
  wrap1.remove();
  userID = id;

  socket.emit("id", userID);
});

function enter(e) {
  if (e.keyCode == 13) {
    lg();
  }
}

function enterC(e) {
  if (e.keyCode == 13) {
    var myChat = document.querySelector("#chat_value").value;
    Chat(myChat);
  }
}

function Sendclick() {
  var myChat = document.querySelector("#chat_value").value;
  Chat(myChat);
}

function Chat(myChat) {
  // 'id : 채팅내용' 백엔드로 보내기
  var chated = document.getElementById("chat_wrap").innerText;
  var newChat = chated + "\n" + userID + " : " + myChat;
  socket.emit("chat", newChat);
  document.querySelector("#chat_value").value = "";
}

socket.on("chatAdd", (chat) => {
  document.getElementById("chat_wrap").innerText = chat;
  const element = document.getElementById("chat_wrap");
  element.scrollTop = element.scrollHeight;
});

socket.on("Clients", (Clients) => {
  document.getElementById("clients").innerText = `현재 접속자 수 : ${Clients}`;
});
