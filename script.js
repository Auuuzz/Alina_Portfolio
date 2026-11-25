document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. 手機版漢堡選單切換
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     2. 圖片載入失敗時的優雅佔位框 (Placeholder)
     ========================================================= */
  const allTriggerImages = document.querySelectorAll('.lightbox-trigger');

  allTriggerImages.forEach((img) => {
    img.addEventListener('error', () => {
      const filePath = img.getAttribute('data-placeholder') || img.getAttribute('src');
      const caption = img.getAttribute('data-caption') || img.getAttribute('alt') || '作品預覽圖';
      const parent = img.parentElement;

      if (!parent) return;

      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder lightbox-trigger';
      placeholder.setAttribute('data-caption', caption);
      placeholder.setAttribute('data-is-placeholder', 'true');
      placeholder.setAttribute('data-placeholder', filePath);
      placeholder.innerHTML = `
        <div class="img-placeholder-icon">🖼️</div>
        <div class="img-placeholder-path">${filePath}</div>
        <div class="img-placeholder-hint">請將圖片放入此路徑以自動顯示（點擊可預覽說明）</div>
      `;

      parent.replaceChild(placeholder, img);
    });
  });

  /* =========================================================
     3. 專案一：提案簡報輪播器 (Carousel)
     ========================================================= */
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('#carouselDots .dot'));
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const counterEl = document.getElementById('carouselCounter');
  let currentSlide = 0;

  function updateCarousel(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    if (counterEl) {
      counterEl.textContent = `${currentSlide + 1} / ${slides.length}`;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentSlide - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentSlide + 1));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = Number(dot.getAttribute('data-slide'));
      if (!Number.isNaN(targetIndex)) {
        updateCarousel(targetIndex);
      }
    });
  });

  /* =========================================================
     4. 專案二：五大展區空間敘事切換器 (Interactive Tabs)
     ========================================================= */
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => {
        const isSelected = b === btn;
        b.classList.toggle('active', isSelected);
        b.setAttribute('aria-selected', String(isSelected));
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });

/* =========================================================
     4-2. 專案二：視窗頂部雙分頁切換 (靜態展覽 vs 動態戲劇)
     ========================================================= */
  const projectTabBtns = Array.from(document.querySelectorAll('.win-top-tab'));
  const projectTabPanels = Array.from(document.querySelectorAll('.project-tab-panel'));

  projectTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-project-tab');

      projectTabBtns.forEach((b) => {
        const isSelected = b === btn;
        b.classList.toggle('active', isSelected);
        b.setAttribute('aria-selected', String(isSelected));
        const indicator = b.querySelector('.tab-indicator');
        if (indicator) {
          indicator.textContent = isSelected ? '●' : '○';
        }
      });

      projectTabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });

  /* =========================================================
     5. 全域 Lightbox 燈箱互動功能 (支援點擊背景與 ESC 關閉)
     ========================================================= */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(targetEl) {
    if (!lightboxModal || !lightboxMediaContainer || !lightboxCaption) return;

    const caption = targetEl.getAttribute('data-caption') || '';
    const isPlaceholder = targetEl.getAttribute('data-is-placeholder') === 'true';

    lightboxMediaContainer.innerHTML = '';

    if (isPlaceholder) {
      const filePath = targetEl.getAttribute('data-placeholder') || '';
      const box = document.createElement('div');
      box.className = 'img-placeholder';
      box.style.minHeight = '260px';
      box.style.cursor = 'default';
      box.innerHTML = `
        <div class="img-placeholder-icon">🖼️</div>
        <div class="img-placeholder-path">${filePath}</div>
        <div class="img-placeholder-hint">目前尚未放置圖片檔案，於 VS Code 放入對應圖片後此燈箱將自動顯示高清大圖。</div>
      `;
      lightboxMediaContainer.appendChild(box);
    } else if (targetEl.tagName === 'IMG') {
      const fullImg = document.createElement('img');
      fullImg.src = targetEl.src;
      fullImg.alt = targetEl.alt || caption;
      lightboxMediaContainer.appendChild(fullImg);
    }

    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 使用事件委派監聽所有圖片與佔位框點擊
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      openLightbox(trigger);
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
});