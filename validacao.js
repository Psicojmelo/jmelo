// validacao.js - Psicólogo Jarismar do Nascimento Melo
(function () {
  'use strict';

  // ========== TOAST SYSTEM ==========
  const Toast = {
    container: null,

    init() {
      if (this.container) return;
      this.container = Object.assign(document.createElement('div'), {
        id: 'toast-container',
        className: 'position-fixed top-0 start-50 translate-middle-x p-3',
        style: 'z-index: 1080'
      });
      document.body.appendChild(this.container);
    },

    show(msg, type = 'info') {
      this.init();
      this.container.innerHTML = '';

      const cfg = {
        success: { icon: 'bi-check-circle-fill',         color: 'success' },
        error:   { icon: 'bi-exclamation-triangle-fill', color: 'danger'  },
        info:    { icon: 'bi-info-circle-fill',           color: 'primary' }
      };
      const { icon, color } = cfg[type] ?? cfg.info;

      const toast = document.createElement('div');
      toast.className = `toast show align-items-center text-bg-${color} border-0 shadow-lg`;
      toast.setAttribute('role', 'status');
      toast.innerHTML = `
        <div class="d-flex align-items-center p-3">
          <i class="bi ${icon} me-2 fs-5"></i>
          <div class="toast-body">${msg}</div>
        </div>`;

      this.container.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  };

  // Um único token de sessão alimenta os formulários da página
  // (contato) — todos os campos com name="csrf_token" são preenchidos.
  let csrfTokenAtual = '';

  function initCSRF() {
    const csrfInputs = document.querySelectorAll('input[name="csrf_token"]');
    if (!csrfInputs.length) return;

    fetch('csrf.php', { method: 'GET', credentials: 'same-origin' })
      .then(r => r.json())
      .then(data => {
        if (data.token) {
          csrfTokenAtual = data.token;
          csrfInputs.forEach(el => { el.value = data.token; });
          console.info('🔒 CSRF token carregado');
        }
      })
      .catch(() => {
        // Sem fallback inseguro: avisa o usuário para recarregar
        Toast.show('Erro de sessão. Recarregue a página antes de enviar.', 'error');
        console.warn('⚠️ CSRF fetch falhou — sem fallback por segurança');
      });
  }

  // ========== VALIDAÇÃO DE TELEFONE ==========
  function validarTelefone(tel) {
    if (!tel) return true;
    const nums = tel.replace(/\D/g, '');
    if (nums.length < 10 || nums.length > 11) return false;
    if (nums.length === 11 && nums[2] !== '9') return false;
    const ddd = parseInt(nums.substring(0, 2), 10);
    if (ddd < 11 || ddd > 99) return false;
    if (/^(\d)\1+$/.test(nums)) return false;
    return true;
  }

  function mensagemTelefone(tel) {
    const nums = tel.replace(/\D/g, '');
    if (nums.length > 0 && nums.length < 10) return 'Telefone incompleto. Digite o DDD + número completo.';
    return 'Telefone inválido. Use: (84) 99999-9999';
  }

  // ========== COLETA DE DADOS DO FORMULÁRIO ==========
  function coletarForm() {
    return {
      nome:     document.getElementById('nome')?.value.trim()     ?? '',
      email:    document.getElementById('email')?.value.trim()    ?? '',
      telefone: document.getElementById('telefone')?.value.trim() ?? '',
      mensagem: document.getElementById('mensagem')?.value.trim() ?? ''
    };
  }

  // ========== VALIDAÇÃO DO FORMULÁRIO (e-mail) ==========
  function validarContato() {
    const form = coletarForm();

    if (form.nome.length < 3) {
      Toast.show('Nome deve ter pelo menos 3 caracteres.', 'error');
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Toast.show('E-mail inválido.', 'error');
      return false;
    }
    if (form.telefone && !validarTelefone(form.telefone)) {
      Toast.show(mensagemTelefone(form.telefone), 'error');
      return false;
    }
    if (form.mensagem.length < 10) {
      Toast.show('Mensagem deve ter pelo menos 10 caracteres.', 'error');
      return false;
    }
    if (form.mensagem.length > 1000) {
      Toast.show('Mensagem muito longa (máx. 1000 caracteres).', 'error');
      return false;
    }

    Toast.show('Enviando mensagem...', 'info');
    return true;
  }

  // ========== ENVIO VIA WHATSAPP ==========
  function enviarWhatsApp() {
    const form = coletarForm();

    if (form.nome.length < 3) {
      Toast.show('Preencha seu nome (mín. 3 caracteres).', 'error');
      return;
    }
    if (form.mensagem.length < 10) {
      Toast.show('Preencha a mensagem (mín. 10 caracteres).', 'error');
      return;
    }
    if (form.telefone && !validarTelefone(form.telefone)) {
      Toast.show(mensagemTelefone(form.telefone), 'error');
      return;
    }

    const numero = '5584981474327';
    let texto = `Olá, Jarismar. Meu nome é ${form.nome}. ${form.mensagem}`;
    if (form.telefone) texto += `\n\nMeu telefone: ${form.telefone}`;

    Toast.show('Abrindo WhatsApp...', 'success');
    setTimeout(() => {
      window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,
        '_blank', 'noopener,noreferrer'
      );
    }, 600);
  }

  // ========== MÁSCARA DE TELEFONE ==========
  function aplicarMascaraTelefone() {
    const tel = document.getElementById('telefone');
    if (!tel) return;

    tel.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 11);

      if      (v.length <= 2)  v = v.replace(/^(\d{0,2})/,               '($1');
      else if (v.length <= 6)  v = v.replace(/^(\d{2})(\d{0,4})/,        '($1) $2');
      else if (v.length <= 10) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else                     v = v.replace(/^(\d{2})(\d{5})(\d{4})/,   '($1) $2-$3');

      e.target.value = v;
    });

    tel.placeholder = '(84) 99999-9999';
  }

  // ========== REVELAÇÃO SUAVE AO ROLAR ==========
  // Puramente aditivo: se o navegador não suportar IntersectionObserver,
  // ou o usuário preferir menos movimento, o conteúdo já é exibido normalmente
  // (a classe .reveal só fica invisível dentro de @media (prefers-reduced-motion: no-preference)).
  function initScrollReveal() {
    const alvos = document.querySelectorAll('.reveal');
    if (!alvos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    alvos.forEach(el => observer.observe(el));
  }

  // ========== SMOOTH SCROLL ==========
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navCollapse = document.querySelector('.navbar-collapse');
        if (navCollapse?.classList.contains('show')) {
          window.bootstrap?.Collapse?.getInstance(navCollapse)?.hide();
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ========== FECHA MENU MOBILE ==========
  function initMobileMenu() {
    document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const menu = document.querySelector('.navbar-collapse');
        if (menu?.classList.contains('show')) {
          window.bootstrap?.Collapse?.getInstance(menu)?.hide();
        }
      });
    });
  }

  // ========== ACESSIBILIDADE ==========
  function initAccessibility() {
    document.querySelectorAll('.btn-float, [target="_blank"]').forEach(el => {
      if (!el.hasAttribute('aria-label') && el.title) {
        el.setAttribute('aria-label', el.title);
      }
      if (el.target === '_blank' && !el.rel.includes('noopener')) {
        el.rel = (el.rel + ' noopener noreferrer').trim();
      }
    });
  }

  // ========== LAZY LOADING ==========
  function initLazyLoad() {
    if (!('loading' in HTMLImageElement.prototype)) return;
    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.closest('.hero')) img.loading = 'lazy';
    });
  }

  // ========== CONEXÃO LENTA ==========
  function checkPerformance() {
    const conn = navigator.connection;
    if (conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') {
      document.documentElement.style.setProperty('--transition', '0.1s');
      console.info('Conexão lenta detectada. Animações reduzidas.');
    }
  }

  // ========== INICIALIZAÇÃO ==========
  function init() {
    initCSRF();
    initSmoothScroll();
    initMobileMenu();
    aplicarMascaraTelefone();
    initAccessibility();
    initLazyLoad();
    checkPerformance();
    initScrollReveal();
    console.info('✅ Site iniciado');
  }

  Object.assign(window, { showToast: Toast.show.bind(Toast), validarContato, enviarWhatsApp, validarTelefone });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
