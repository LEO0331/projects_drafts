const form = document.getElementById('noteForm');
const input = document.getElementById('noteInput');
const list = document.getElementById('noteList');

const state = JSON.parse(localStorage.getItem('sticky-notes') || '[]');
state.forEach(addNoteToDom);

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  state.push(text);
  localStorage.setItem('sticky-notes', JSON.stringify(state));
  addNoteToDom(text);
  input.value = '';
});

function addNoteToDom(text) {
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
}
