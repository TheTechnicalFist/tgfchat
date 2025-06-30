async function loadGifs() {
  try {
    const res = await fetch('./gifs.json');
    const gifs = await res.json();
    const container = document.getElementById('gifContainer');

    gifs.forEach(gif => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="./media/${gif.command}.gif" alt="${gif.command}">
        <p>!gif ${gif.command}</p>
      `;

      card.addEventListener('click', () => {
        navigator.clipboard.writeText(`!gif ${gif.command}`);
        showToast();
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error('❌ Failed to load gifs.json:', err);
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

loadGifs();
