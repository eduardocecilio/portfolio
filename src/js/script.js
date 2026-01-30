/**
 * Menu responsivo e Lógica de Navegação
 */
(function () {
    let menuInitialized = false;

    const initMenu = () => {
        // Seleção de elementos (Caminhos internos ao componente carregado)
        const menuToggle = document.querySelector('.menu-toggle');
        const menuNav = document.querySelector('.cabecalho__menu');
        const menuItems = document.querySelectorAll('.cabecalho__menu__item');
        
        if (!menuNav) return; // Se o header ainda não carregou, sai da função
        if (menuInitialized) return;

        menuInitialized = true;
        const body = document.body;

        // 1. Marcar o link da página atual como ativo (Melhor Prática SEO/UX)
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        const allLinks = menuNav.querySelectorAll('.cabecalho__menu__link');
        
        allLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('link-ativo'); // Estilize isso no seu CSS
                link.setAttribute('aria-current', 'page');
            }
        });

        // 2. Configuração do menu mobile (Hambúrguer)
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isOpened = menuToggle.classList.toggle('active');
                menuNav.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', isOpened);
                body.style.overflow = isOpened ? 'hidden' : '';
            });
        }

        // 3. Lógica de Submenus (Dropdown de Projetos)
        menuItems.forEach(item => {
            const menuLink = item.querySelector('.cabecalho__menu__link');
            if (!menuLink) return;

            menuLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const isAberto = item.classList.contains('active');
                    
                    // Só previne o clique se for o item com submenu
                    if (item.querySelector('.submenu')) {
                        e.preventDefault();
                        // Fecha outros
                        menuItems.forEach(i => i !== item && i.classList.remove('active'));
                        item.classList.toggle('active');
                        menuLink.setAttribute('aria-expanded', !isAberto);
                    }
                }
            });
        });

        // 4. Fechar ao clicar fora ou redimensionar
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.cabecalho__menu') && 
                !e.target.closest('.menu-toggle') && 
                menuNav.classList.contains('active')) {
                
                menuToggle?.classList.remove('active');
                menuNav.classList.remove('active');
                body.style.overflow = '';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle?.classList.remove('active');
                menuNav.classList.remove('active');
                body.style.overflow = '';
            }
        });
    };

    // Escuta o evento que você criou no includes.js
    document.addEventListener('includes:loaded', (e) => {
        if (e.detail.id === 'header') {
            initMenu();
        }
    });

    // Fallback caso o DOM já esteja pronto
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initMenu();
    } else {
        document.addEventListener('DOMContentLoaded', initMenu);
    }
})();