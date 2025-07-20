const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Add a "thinking" message and get a reference to it
  appendMessage('bot', 'Gemini is thinking...');
  const lastBotMessage = chatBox.querySelector('.message.bot:last-child');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Update the "thinking" message with the actual response
    lastBotMessage.textContent = data.response;
  } catch (error) {
    console.error('Error fetching response:', error);
    // Update the "thinking" message with an error message
    lastBotMessage.textContent = 'Sorry, I ran into an error. Please try again.';
  } finally {
    // Ensure the chat box is scrolled to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
