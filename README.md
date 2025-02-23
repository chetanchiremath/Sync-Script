# Real-Time Collaborative Code Editor

## Overview
This project is a **real-time collaborative code editor** built using **Node.js, Express, and Socket.io** for the backend and **React with CodeMirror** for the frontend. Users can write and edit code simultaneously in a shared session, with live updates reflecting instantly.

## Features
- **Real-time code collaboration** using WebSockets
- **Multiple users in a shared session**
- **Syntax highlighting** via CodeMirror
- **Automatic synchronization** for new users
- **Error handling** for socket failures

## Tech Stack
### Backend:
- Node.js
- Express.js
- Socket.io

### Frontend:
- React.js
- CodeMirror
- Tailwind CSS (for styling)

## Setup and Installation
### Prerequisites:
- Node.js installed (v16+ recommended)
- npm or yarn installed

### Steps to Run Locally
#### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/realtime-code-editor.git
cd realtime-code-editor
```

#### 2️⃣ Install Dependencies
**For Backend:**
```sh
cd server
npm install
```

**For Frontend:**
```sh
cd client
npm install
```

#### 3️⃣ Start the Server
```sh
cd server
node server.js
```

#### 4️⃣ Start the Client
```sh
cd client
npm start
```

The project should now be running at **http://localhost:3000** 🚀

## Folder Structure
```
realtime-code-editor/
│── client/                 # Frontend (React + CodeMirror)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Main Pages (EditorPage)
│   │   ├── utils/          # Helper functions
│   ├── public/             # Static files
│   ├── package.json        # Frontend dependencies
│
│── server/                 # Backend (Node.js + Socket.io)
│   ├── server.js           # Main Server File
│   ├── package.json        # Backend dependencies
│
└── README.md               # Project Documentation
```

## How It Works
1. **User joins a session** by entering a room ID.
2. The **server syncs existing code** with the new user.
3. When a user types, **changes are broadcasted** via Socket.io.
4. All users in the same session see the updates **instantly**.

## Key Code Highlights
### Handling Code Changes (Frontend)
```javascript
editorRef.current.on("change", (instance, changes) => {
    const { origin } = changes;
    const code = instance.getValue();
    if (origin !== "setValue") {
        socketRef.current.emit("code-change", { roomId, code });
    }
});
```
➡ This detects when a user types and emits a **code-change event**.

### Receiving Code Updates (Frontend)
```javascript
socketRef.current.on("code-change", ({ code }) => {
    if (code !== null) {
        editorRef.current.setValue(code);
    }
});
```
➡ When another user updates the code, this ensures everyone else sees the changes.

### Broadcasting Code Updates (Backend)
```javascript
socket.on("code-change", ({ roomId, code }) => {
    socket.in(roomId).emit("code-change", { code });
});
```
➡ The server **relays code changes** to everyone in the same room.

## Future Enhancements
✅ **Authentication** – Allow users to sign in and track authorship.
✅ **Multiple File Support** – Enable users to collaborate on multiple files in a session.
✅ **Database Storage** – Store code history and allow reloading of previous versions.
✅ **Language Support** – Add support for Python, Java, C++, and more.

## Contributing
1. Fork the repo & create a new branch.
2. Make your changes and push them.
3. Submit a PR with a clear explanation.

## Contact
Feel free to connect via [GitHub](https://github.com/yourusername) or email at `your.email@example.com`. Happy coding! 🎉

