const container = document.getElementById('gifContainer');
const toast     = document.getElementById('toast');
const search    = document.getElementById('search');
let gifs = [];

// load & render
async function loadGifs() {
  try {
    const res  = await fetch('gifs.json');
    gifs        = await res.json();
    displayGifs(gifs);
  } catch (e) {
    console.error('Failed to load gifs.json', e);
    container.innerHTML = '<p style="color:#e55">Failed to load GIFs.</p>';
  }
}

function displayGifs(list) {
  container.innerHTML = '';
  list.forEach(gif => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="media/${gif.command}.gif" alt="${gif.command}">
      <p>!gif ${gif.command}</p>
    `;
    card.addEventListener('click', () => copyCommand(gif.command));
    container.appendChild(card);
  });
}

function copyCommand(cmd) {
  navigator.clipboard.writeText(`!gif ${cmd}`);
  showToast();
}

function showToast() {
  toast.classList.add('show');
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// filter UI
search.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  displayGifs(gifs.filter(g => g.command.includes(term)));
});

loadGifs();
