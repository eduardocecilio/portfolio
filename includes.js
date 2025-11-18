document.addEventListener('DOMContentLoaded', () => {
  const loadInclude = (id, file) => {
    const el = document.getElementById(id);
    if (el) {
      fetch(file)
        .then(response => response.text())
        .then(data => {
          el.innerHTML = data;
          // Notifica que um include foi carregado (útil para inicializar scripts dependentes)
          document.dispatchEvent(new CustomEvent('includes:loaded', { detail: { id } }));
        });
    }
  };
  loadInclude('header', 'header.html');
  loadInclude('footer', 'footer.html');
});