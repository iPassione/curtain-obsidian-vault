(() => {
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const addClass = (element, className) => element && element.classList.add(className);
  const removeClass = (element, className) => element && element.classList.remove(className);

  const initIcons = () => {
    if (typeof window.lucide !== 'undefined') {
      window.lucide.createIcons();
    }
  };

  const initMenu = () => {
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-open'));
    });

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (event.target.closest('[data-nav]') || event.target.closest('[data-menu-toggle]')) return;
      setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
  };

  const initReveal = () => {
    const panel = document.querySelector('[data-reveal-panel]');
    const toggle = document.querySelector('[data-reveal-toggle]');
    if (!panel || !toggle) return;

    const togglePanel = () => {
      const open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      const label = toggle.querySelector('span');
      if (label) label.textContent = open ? '收起' : '继续读';
    };

    toggle.addEventListener('click', togglePanel);
  };

  const initStory = () => {
    const cards = Array.from(document.querySelectorAll('[data-story-card]'));
    cards.forEach((card) => {
      const head = card.querySelector('.story-card__head');
      if (!head) return;
      head.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        cards.forEach((item) => {
          const itemHead = item.querySelector('.story-card__head');
          const shouldOpen = !isOpen && item === card;
          item.classList.toggle('is-open', shouldOpen);
          itemHead?.setAttribute('aria-expanded', String(shouldOpen));
        });
      });
    });
  };

  const initArc = () => {
    const phaseButtons = Array.from(document.querySelectorAll('[data-arc-phase]'));
    const stage = document.querySelector('[data-arc-stage]');
    if (!phaseButtons.length || !stage) return;

    const phases = [
      {
        index: '01 / 04',
        title: '天才',
        copy: '足够强的人，通常会把世界看得很简单。庭代尔一开始也是这样：他确信自己护得住弟弟，也确信自己能决定去往哪里。',
        quote: '他不是一个好脾气的人。他只是把好脾气，留给了很少的人。'
      },
      {
        index: '02 / 04',
        title: '暴君',
        copy: '北海夺走卡西乌斯之后，他不再和自己讲道理。他炼成真神，杀上天国，把六枚神格带回人间。他相信只要够强，就能让命运换一种写法。',
        quote: '他把最冷酷的一面给了世界，把所有的温柔留给了爱的人。'
      },
      {
        index: '03 / 04',
        title: '无瑕',
        copy: '神眷之战让他看见，仇恨不会因为胜利停止。他结束战争，封印圣廷，解散骑士团，最后斩去自己的恶念、主宰神格与那份他不允许自己保留的父爱。',
        quote: '他变得足够无瑕，也因此不再完整。'
      },
      {
        index: '04 / 04',
        title: '执棋者',
        copy: '最后五年，他把目标从力量换成变数。他找到拉苏斯，创造法德利，安排赫法恩斯，也把自己的死亡写进棋局。他让自己离开，给另一个答案留出抵达的余地。',
        quote: '他没有让自己成为答案。他留下的，是答案仍有可能发生。'
      }
    ];

    const selectPhase = (index, animate = true) => {
      phaseButtons.forEach((phaseButton, phaseIndex) => {
        const active = phaseIndex === index;
        phaseButton.classList.toggle('is-active', active);
        phaseButton.setAttribute('aria-selected', String(active));
        phaseButton.tabIndex = active ? 0 : -1;
      });

      const phase = phases[index];
      const title = stage.querySelector('[data-arc-title]');
      const copy = stage.querySelector('[data-arc-copy]');
      const quote = stage.querySelector('[data-arc-quote]');
      const indexLabel = stage.querySelector('[data-arc-index]');
      stage.setAttribute('aria-labelledby', phaseButtons[index]?.id || '');
      if (indexLabel) indexLabel.textContent = phase.index;
      if (title) title.textContent = phase.title;
      if (copy) copy.textContent = phase.copy;
      if (quote) quote.textContent = phase.quote;

      if (animate && hasGsap && !prefersReducedMotion) {
        window.gsap.fromTo(
          [title, copy, quote, indexLabel],
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
        );
      }
    };

    phaseButtons.forEach((button, index) => {
      button.addEventListener('click', () => selectPhase(index));
      button.addEventListener('keydown', (event) => {
        const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const lastIndex = phaseButtons.length - 1;
        const nextIndex = {
          ArrowRight: index === lastIndex ? 0 : index + 1,
          ArrowLeft: index === 0 ? lastIndex : index - 1,
          Home: 0,
          End: lastIndex
        }[event.key];
        selectPhase(nextIndex);
        phaseButtons[nextIndex]?.focus();
      });
    });

    selectPhase(0, false);
  };

  const initGsap = () => {
    if (!hasGsap) return;
    if (hasScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
    if (window.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      window.gsap.set('.hero__name span, [data-hero-reveal], .button, .door, .timeline-item, .link-chip, .archive__row', { clearProps: 'all' });
      return;
    }

    window.gsap.set('[data-hero-reveal], .hero__name span, .hero__subtitle, .hero__eyebrow, .hero__actions', { autoAlpha: 0, y: 24 });

    const intro = window.gsap.timeline({ delay: 0.18 });
    intro
      .to('.hero__eyebrow, .hero__name span', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' })
      .to('.hero__subtitle, [data-hero-reveal]', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.35')
      .to('.hero__actions', { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.25');

    window.gsap.to('[data-hero-art]', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-hero]',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    const revealItems = window.gsap.utils.toArray('.door, .timeline-item, .link-chip, .archive__row, .story-card, .arc__panel');
    revealItems.forEach((item) => {
      window.gsap.fromTo(item, { autoAlpha: 0, y: 34 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    if (hasScrollTrigger) {
      window.ScrollTrigger.refresh();
      window.addEventListener('load', () => window.ScrollTrigger.refresh(), { once: true });
    }
  };

  const initScrollSpy = () => {
    const links = Array.from(document.querySelectorAll('[data-nav] .nav__link'));
    const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-28% 0px -55% 0px', threshold: 0.1 });

    sections.forEach((section) => observer.observe(section));
  };

  const smoothScroll = (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    if (hasGsap && window.ScrollToPlugin && !prefersReducedMotion) {
      window.gsap.to(window, {
        scrollTo: { y: target, offsetY: 72 },
        duration: 0.9,
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    } else {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  document.addEventListener('click', smoothScroll);
  document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initMenu();
    initReveal();
    initStory();
    initArc();
    initGsap();
    initScrollSpy();
  });
})();
