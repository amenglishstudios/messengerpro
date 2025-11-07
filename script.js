const speakerSelect = document.getElementById('speaker');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const conversationEl = document.getElementById('conversation');
const nameAInput = document.getElementById('nameA');
const nameBInput = document.getElementById('nameB');
const contactName = document.getElementById('contactName');

const exportImageBtn = document.getElementById('exportImageBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportGifBtn = document.getElementById('exportGifBtn');

function currentTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createDeleteButton() {
  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.textContent = '❌';
  btn.onclick = (e) => {
    e.stopPropagation();
    btn.closest('.message').remove();
  };
  return btn;
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

function addMessage(speaker, text, timestamp = null) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `person-${speaker}`);

  const name = speaker === 'a'
    ? (nameAInput.value.trim() || 'Character A')
    : (nameBInput.value.trim() || 'Character B');
  const initials = getInitials(name);

  const avatar = document.createElement('div');
  avatar.className = 'avatar‑initials';
  avatar.textContent = initials;

  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.classList.add('bubble-wrapper');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.textContent = text;
  bubble.appendChild(createDeleteButton());

  const nameLabel = document.createElement('div');
  nameLabel.className = 'name-label';
  nameLabel.textContent = name;

  const timeEl = document.createElement('div');
  timeEl.classList.add('timestamp');
  timeEl.textContent = timestamp || currentTimestamp();

  bubbleWrapper.appendChild(bubble);
  bubbleWrapper.appendChild(nameLabel);
  bubbleWrapper.appendChild(timeEl);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubbleWrapper);
  conversationEl.appendChild(messageDiv);
  conversationEl.scrollTop = conversationEl.scrollHeight;
}

sendBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const speaker = speakerSelect.value;
  const nameA = nameAInput.value.trim() || 'Character A';
  const nameB = nameBInput.value.trim() || 'Character B';

  contactName.textContent = speaker === 'a' ? nameB : nameA;

  addMessage(speaker, text);
  messageInput.value = '';
});

// Export PNG
exportImageBtn.addEventListener('click', async () => {
  const canvas = await html2canvas(document.querySelector('.iphone'));
  const dataURL = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'conversation.png';
  link.click();
});

// Export PDF
exportPdfBtn.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(document.querySelector('.iphone'), { backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const ratio = canvas.height / canvas.width;
  const height = pageWidth * ratio;

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, height);
  pdf.save('conversation.pdf');
});

// Export GIF
exportGifBtn.addEventListener('click', async () => {
  const messages = [...conversationEl.children];
  const gif = new GIF({ workers: 2, quality: 10 });

  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);

  for (let i = 0; i < messages.length; i++) {
    const clone = messages.slice(0, i + 1).map(msg => msg.cloneNode(true));
    tempContainer.innerHTML = '';
    clone.forEach(m => tempContainer.appendChild(m));

    const canvas = await html2canvas(tempContainer, { backgroundColor: '#fff' });
    gif.addFrame(canvas, { delay: 1000 });
  }

  gif.on('finished', (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.gif';
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(tempContainer);
  });

  gif.render();
});
