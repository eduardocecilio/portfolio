const loadInclude = async (id, file) => {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const response = await fetch(`./src/components/${file}`);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    const data = await response.text();
    
    el.innerHTML = data;
    
    // Notifica o script.js que o header/footer chegou
    document.dispatchEvent(new CustomEvent('includes:loaded', { detail: { id } }));
  } catch (error) {
    console.error(`Erro ao carregar ${file}:`, error);
  }
};

// Esta função garante que o script espere as DIVs existirem no HTML
const initIncludes = () => {
    loadInclude('header', 'header.html');
    loadInclude('footer', 'footer.html');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIncludes);
} else {
    initIncludes();
}