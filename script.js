
/**
 * Menu responsivo para o portfólio
 * Ajustado para esperar o carregamento do include do `header` (evento: includes:loaded)
 */
(function () {
    let menuInitialized = false;

    const initMenu = () => {
        if (menuInitialized) return;

        const menuToggle = document.querySelector('.menu-toggle');
        const menuNav = document.querySelector('.cabecalho__menu');
        const menuItems = document.querySelectorAll('.cabecalho__menu__item');
        const body = document.body;
        // Seleciona todos os links com href diferente de '#' (exclui o toggle "Projetos")
        const menuLinks = menuNav ? Array.from(menuNav.querySelectorAll('a[href]')).filter(a => a.getAttribute('href') !== '#') : [];

        if (!menuNav || !menuItems.length) {
            console.warn('Elementos de menu não encontrados.');
            return;
        }

        menuInitialized = true;

        // Configuração do menu mobile
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                menuNav.classList.toggle('active');
                body.style.overflow = menuNav.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Submenus (mobile toggle / desktop hover)
        menuItems.forEach(item => {
            const menuLink = item.querySelector('.cabecalho__menu__link');
            if (!menuLink) return;

            menuLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const wasActive = item.classList.contains('active');

                    // Fecha outros submenus
                    menuItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherLink = otherItem.querySelector('.cabecalho__menu__link');
                            if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
                        }
                    });

                    item.classList.toggle('active', !wasActive);
                    menuLink.setAttribute('aria-expanded', !wasActive ? 'true' : 'false');
                } else {
                    // No desktop, prevenir comportamento padrão caso queira manter hover
                    e.preventDefault();
                }
            });
        });

        // Fechar o menu ao clicar em um link de navegação (no mobile)
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se for mobile, animamos o fechamento antes de navegar para dar sensação mais suave
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const href = link.getAttribute('href');

                    if (menuToggle) menuToggle.classList.remove('active');
                    menuNav.classList.remove('active');
                    body.style.overflow = '';

                    // Aguarda a transição do menu (200ms) e então navega
                    setTimeout(() => {
                        // navegação segura
                        window.location.href = href;
                    }, 200);
                }
            });
        });

        // Fechar o menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.cabecalho__menu') && !e.target.closest('.menu-toggle') && menuNav.classList.contains('active')) {
                if (menuToggle) menuToggle.classList.remove('active');
                menuNav.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Ajuste ao redimensionar
        let resizeTimeout;
        const resetMobileMenuState = () => {
            if (window.innerWidth > 768) {
                if (menuToggle) menuToggle.classList.remove('active');
                menuNav.classList.remove('active');
                body.style.overflow = '';
                menuItems.forEach(item => item.classList.remove('active'));
            }
        };
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resetMobileMenuState, 100);
        });

        // Navegação por teclado (manter acesso)
        menuItems.forEach(item => {
            const menuLink = item.querySelector('.cabecalho__menu__link');
            if (!menuLink) return;

            menuLink.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth > 768) {
                    e.preventDefault();
                    item.classList.add('active');
                    menuLink.setAttribute('aria-expanded', 'true');
                }
                if (e.key === 'Escape' && item.classList.contains('active')) {
                    item.classList.remove('active');
                    menuLink.setAttribute('aria-expanded', 'false');
                    menuLink.focus();
                }
            });
        });
    };

    // Inicializa quando o DOM estiver pronto e também quando os includes forem inseridos
    document.addEventListener('DOMContentLoaded', initMenu);
    document.addEventListener('includes:loaded', initMenu);
})();
