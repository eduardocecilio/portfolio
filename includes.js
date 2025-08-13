document.addEventListener('DOMContentLoaded', () => {
  const loadInclude = (id, file) => {
    const el = document.getElementById(id);
    if (el) {
      fetch(file)
        .then(response => response.text())
        .then(data => el.innerHTML = data);
    }
  };
  loadInclude('header', 'header.html');
  loadInclude('footer', 'footer.html');
});