// Update with your actual Replit backend URL
const backendUrl = "https://School-Chat.replit.app";
const socket = io(backendUrl);
let currentUser = null;

// Login functionality
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const res = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await res.json();
  if (data.token) {
    currentUser = username;
    document.getElementById('current-user').innerText = username;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    socket.emit('login', username);
  } else {
    alert(data.message || "Login failed");
  }
});

// Signup functionality
document.getElementById('signup-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const res = await fetch(`${backendUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await res.json();
  if (res.ok) {
    alert("Signup successful! You can now log in.");
  } else {
    alert(data.message || "Signup failed");
  }
});

// Add friend functionality
document.getElementById('add-friend-btn').addEventListener('click', async () => {
  const friendUsername = document.getElementById('friend-username').value;
  const res = await fetch(`${backendUrl}/add-friend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, friendUsername })
  });
  const data = await res.json();
  if (res.ok) {
    alert("Friend added");
    // Update friend list UI
    const li = document.createElement('li');
    li.innerText = friendUsername;
    li.addEventListener('click', () => {
      activeFriend = friendUsername;
      alert(`Now messaging ${friendUsername}`);
    });
    document.getElementById('friend-list').appendChild(li);
  } else {
    alert(data.message || "Failed to add friend");
  }
});

let activeFriend = null;

// Send direct message functionality
document.getElementById('send-msg-btn').addEventListener('click', () => {
  const message = document.getElementById('message-input').value;
  if (!activeFriend) {
    alert("Select a friend to message!");
    return;
  }
  socket.emit('send-message', { sender: currentUser, receiver: activeFriend, message });
  
  // Display your sent message
  const msgDiv = document.createElement('div');
  msgDiv.innerText = `You: ${message}`;
  document.getElementById('messages').appendChild(msgDiv);
  document.getElementById('message-input').value = "";
});

// Receive direct messages
socket.on('receive-message', (data) => {
  const { sender, message } = data;
  // Only display if message is from the friend you’re actively chatting with
  if (sender === activeFriend) {
    const msgDiv = document.createElement('div');
    msgDiv.innerText = `${sender}: ${message}`;
    document.getElementById('messages').appendChild(msgDiv);
  }
});
