
# None-DB-Login
DB 없이 회원가입/로그인 구현 +채팅

### 모듈
* Express: Node.js 사용. HTTP 요청 처리 및 정적 파일 서비스 제공.
* Socket.IO: 실시간 양방향 통신을 위한 라이브러리로 사용. 클라이언트와 서버 간의 실시간 데이터 전송을 담당.
* fs (File System): 파일 시스템과 상호작용하기 위해 사용. 사용자 정보를 파일로 저장하고, 파일에서 정보를 읽어오는 작업에 활용

### 파일 형식
* userinfo.txt: 사용자 정보를 저장하기 위한 텍스트 파일. 각 사용자의 아이디와 비밀번호가 JSON 형식으로 저장.
```
[
  { "id": "user1", "password": "pass123" },
  { "id": "user2", "password": "pass456" },
  ...
]
```
위와 같은 구조로 사용자 정보가 userinfo.txt 파일에 저장.   
회원가입 시 새로운 사용자 정보가 이 배열에 추가되고, 로그인 시 입력된 아이디와 비밀번호와 비교.   

#### 채팅
접속시 ChatLog.txt 내용을 클라이언트에게 전달, 출력   
채팅 입력시 채팅 내용을 ChatLog.txt에 추가, 저장   
저장 후 모든 클라이언트에게 전송, 출력

### URL
https://scented-subdued-rose.glitch.me/

> 참고: 이 코드는 단순한 예시를 위한 것으로 실전 사용에는 적합하지 않을 수 있습니다. 
> 실제 사용 시에는 추가적인 에러 처리 및 보안 검증을 고려해야 합니다.
> 실무에서는 데이터베이스와 인증 시스템을 사용하여 보안 및 안정성을 강화하는 것이 권장됩니다.
