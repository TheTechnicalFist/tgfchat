fetch('gifs.json')
  .then(response => response.json())
  .then(gifs => {
    console.log('response', response)
    const container = document.getElementById("gifContainer");

    gifs.forEach(gif => {
      const card = document.createElement("div");
      card.className = "command-card";
      card.onclick = () => copyCommand(`!gif ${gif.command}`);

      card.innerHTML = `
        <div class="command-text">!gif ${gif.command}</div>
        <div class="command-gif">
          <img src="${gif.url}" alt="${gif.command} gif">
        </div>
      `;

      container.appendChild(card);
    });
  });

function copyCommand(commandText) {
  navigator.clipboard.writeText(commandText).then(() => {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  });
}
