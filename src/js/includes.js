document.addEventListener('DOMContentLoaded', () => {
  const loadInclude = (id, file) => {
    const el = document.getElementById(id);
    if (el) {
      // Agora buscamos dentro de src/components/
      fetch(`src/components/${file}`)
        .then(response => {
          if (!response.ok) throw new Error(`Erro ao carregar ${file}: ${response.statusText}`);
          return response.text();
        })
        .then(data => {
          el.innerHTML = data;
          // Dispara o evento para caso outros scripts precisem do header/footer pronto
          document.dispatchEvent(new CustomEvent('includes:loaded', { detail: { id } }));
        })
        .catch(error => console.error('Erro no include:', error));
    }
  };

  loadInclude('header', 'header.html');
  loadInclude('footer', 'footer.html');
});