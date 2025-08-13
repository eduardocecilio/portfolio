
/**
 * Menu responsivo para o portfólio
 * @author Eduardo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Cache de elementos DOM para melhor performance
    const elements = {
        menuToggle: document.querySelector('.menu-toggle'),
        menuNav: document.querySelector('.cabecalho__menu'),
        menuItems: document.querySelectorAll('.cabecalho__menu__item'),
        body: document.body,
        menuLinks: document.querySelectorAll('.cabecalho__menu a:not(.cabecalho__menu__item > .cabecalho__menu__link)')
    };
    
    // Verificar se os elementos necessários existem antes de continuar
    if (!elements.menuNav || !elements.menuItems.length) {
        console.warn('Elementos de menu não encontrados.');
        return;
    }
    
    // Configuração do menu mobile
    const setupMobileMenu = () => {
        if (!elements.menuToggle) return;
        
        elements.menuToggle.addEventListener('click', () => {
            elements.menuToggle.classList.toggle('active');
            elements.menuNav.classList.toggle('active');
            
            // Controle de scroll
            elements.body.style.overflow = elements.menuNav.classList.contains('active') ? 'hidden' : '';
        });
    };
    
    // Configuração dos submenus (diferente para mobile e desktop)
    const setupSubmenus = () => {
        elements.menuItems.forEach(item => {
            const menuLink = item.querySelector('.cabecalho__menu__link');
            if (menuLink) {
                // Em dispositivos móveis, toggle ao clicar
                menuLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Toggle do estado ativo
                        const wasActive = item.classList.contains('active');
                        
                        // Fechar todos os outros submenus primeiro
                        elements.menuItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                                const otherLink = otherItem.querySelector('.cabecalho__menu__link');
                                if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
                            }
                        });
                        
                        // Toggle do menu atual
                        item.classList.toggle('active', !wasActive);
                        menuLink.setAttribute('aria-expanded', !wasActive ? 'true' : 'false');
                    } else {
                        // No desktop, apenas prevenir a navegação do link "Projetos"
                        e.preventDefault();
                    }
                });
            }
        });
    };
    
    // Fechar o menu ao clicar em um link
    const setupMenuLinkClosing = () => {
        elements.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    elements.menuToggle.classList.remove('active');
                    elements.menuNav.classList.remove('active');
                    elements.body.style.overflow = '';
                }
            });
        });
    };
    
    // Fechar o menu ao clicar fora
    const setupOutsideClickClosing = () => {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.cabecalho__menu') && 
                !e.target.closest('.menu-toggle') && 
                elements.menuNav.classList.contains('active')) {
                elements.menuToggle.classList.remove('active');
                elements.menuNav.classList.remove('active');
                elements.body.style.overflow = '';
            }
        });
    };
    
    // Ajuste de viewport quando a tela é redimensionada
    const setupResizeHandling = () => {
        const resetMobileMenuState = () => {
            if (window.innerWidth > 768) {
                elements.menuToggle.classList.remove('active');
                elements.menuNav.classList.remove('active');
                elements.body.style.overflow = '';
                
                elements.menuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        };
        
        // Throttle para melhorar performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resetMobileMenuState, 100);
        });
    };
    
    // Adicionar suporte para navegação por teclado
    const setupKeyboardNavigation = () => {
        elements.menuItems.forEach(item => {
            const menuLink = item.querySelector('.cabecalho__menu__link');
            if (menuLink) {
                menuLink.addEventListener('keydown', (e) => {
                    // Abrir submenu com tecla Enter ou Space
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth > 768) {
                        e.preventDefault();
                        item.classList.add('active');
                        menuLink.setAttribute('aria-expanded', 'true');
                    }
                    
                    // Fechar submenu com Escape
                    if (e.key === 'Escape' && item.classList.contains('active')) {
                        item.classList.remove('active');
                        menuLink.setAttribute('aria-expanded', 'false');
                        menuLink.focus();
                    }
                });
            }
            
            // Fechar submenu quando o foco sair do submenu
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                const submenuLinks = submenu.querySelectorAll('a');
                if (submenuLinks.length) {
                    submenuLinks[submenuLinks.length - 1].addEventListener('blur', () => {
                        if (!submenu.contains(document.activeElement) && window.innerWidth > 768) {
                            item.classList.remove('active');
                            menuLink.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            }
        });
    };

    // Inicialização
    setupMobileMenu();
    setupSubmenus();
    setupMenuLinkClosing();
    setupOutsideClickClosing();
    setupResizeHandling();
    setupKeyboardNavigation();
});
