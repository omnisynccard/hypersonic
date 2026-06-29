/* ════════════════════════════════════════════════════════════
   Hypersonic - 多人數位名片系統 (子路徑方式)
   framework/main.js - 共用框架邏輯
   ════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ════════════════════════════════════════════
     全域變數
     ════════════════════════════════════════════ */
  let PEOPLE_CONFIG = null;
  let CURRENT_PERSON = null;

  /* ════════════════════════════════════════════
     從 URL 路徑取得職員 ID
     ════════════════════════════════════════════ */
  function getPersonIdFromPath() {
    const path = window.location.pathname;
    console.log('[Debug] 當前路徑:', path);
    console.log('[Debug] 當前 URL:', window.location.href);
    
    // 方法 1: 從 HTML body 的 data 屬性取得
    const bodyPersonId = document.body.getAttribute('data-person-id');
    if (bodyPersonId) {
      console.log('[Debug] 從 data 屬性取得職員 ID:', bodyPersonId);
      return bodyPersonId;
    }
    
    // 方法 2: 從 URL 查詢參數取得
    const params = new URLSearchParams(window.location.search);
    const queryPersonId = params.get('id');
    if (queryPersonId) {
      console.log('[Debug] 從查詢參數取得職員 ID:', queryPersonId);
      return queryPersonId;
    }
    
    // 方法 3: 從 URL 路徑提取
    const cleanPath = path.replace(/\/$/, '');
    const pathSegments = cleanPath.split('/').filter(s => s && s !== 'hypersonic' && s !== 'framework');
    
    if (pathSegments.length > 0) {
      const personId = pathSegments[pathSegments.length - 1];
      if (personId !== 'index.html' && personId !== 'people' && !personId.includes('.')) {
        console.log('[Debug] 從路徑提取職員 ID:', personId);
        return personId;
      }
    }
    
    console.log('[Debug] 無法從任何方式提取職員 ID');
    return null;
  }

  /* ════════════════════════════════════════════
     載入中央配置檔案
     ════════════════════════════════════════════ */
  async function loadPeopleConfig() {
    try {
      const response = await fetch('../people.json');
      if (!response.ok) throw new Error('無法載入 people.json');
      PEOPLE_CONFIG = await response.json();
      console.log('[Init] 已載入中央配置:', PEOPLE_CONFIG);
    } catch (error) {
      console.error('[Init] 載入配置失敗:', error);
      throw error;
    }
  }

  /* ════════════════════════════════════════════
     載入職員資料
     ════════════════════════════════════════════ */
  function loadPerson(personId) {
    const person = PEOPLE_CONFIG.people.find(p => p.id === personId);
    if (!person) {
      throw new Error(`找不到職員: ${personId}`);
    }
    CURRENT_PERSON = person;
    console.log('[Init] 已載入職員:', person.name.zh);
  }

  /* ════════════════════════════════════════════
     套用主題色
     ════════════════════════════════════════════ */
  function applyTheme() {
    const theme = PEOPLE_CONFIG.theme;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
  }

  /* ════════════════════════════════════════════
     渲染個人資訊區
     ════════════════════════════════════════════ */
  function renderProfile() {
    const person = CURRENT_PERSON;
    const company = PEOPLE_CONFIG.company;

    // 頂部橫幅
    const header = document.querySelector('.card__header');
    if (header) {
      header.innerHTML = `
        <div class="card__header-left">
          ${company.logoUrl ? `
            <a href="${company.website}" class="card__logo-link" title="前往公司官網">
              <img src="../${company.logoUrl}" alt="${company.name}" class="card__logo" 
                   onerror="this.style.display='none'">
            </a>
          ` : ''}
        </div>
        <div class="card__header-right">
          ${company.stockCode ? `
            <a href="https://tw.stock.yahoo.com/quote/${company.stockCode}" 
               target="_blank" class="card__stock-badge" title="查看股價">
              ${company.stockMarket || 'TWSE'}: ${company.stockCode}
            </a>
          ` : ''}
        </div>
      `;
    }

    // 個人資訊
    const profile = document.querySelector('.card__profile');
    if (profile) {
      profile.innerHTML = `
        <button class="card__avatar-btn" title="點擊放大照片">
          <img src="../${person.assets.photoUrl}" alt="${person.name.zh}" class="card__avatar"
               onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(person.name.en)}&size=200&background=1a3a5c&color=fff&bold=true'">
          <div class="card__avatar-overlay">🔍</div>
        </button>
        <div class="card__name-block">
          <div class="card__name-zh">${person.name.zh}</div>
          <div class="card__name-en">${person.name.en}</div>
        </div>
        <div class="card__title-block">
          <span class="card__title">${person.title}</span>
          ${person.department ? `<span class="card__divider">•</span><span class="card__dept">${person.department}</span>` : ''}
        </div>
        <div class="card__company">${company.name}</div>
      `;
    }

    // 綁定照片點擊事件
    const avatarBtn = document.querySelector('.card__avatar-btn');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', () => showLightbox(person.assets.photoUrl));
    }
  }

  /* ════════════════════════════════════════════
     渲染聯絡資訊
     ════════════════════════════════════════════ */
  function renderContacts() {
    const person = CURRENT_PERSON;
    const contacts = document.querySelector('.card__contacts');
    if (!contacts) return;

    let html = '';

    // 手機
    if (person.contact.mobile) {
      html += `
        <a href="tel:${person.contact.mobile}" class="card__contact-item">
          <div class="card__contact-icon card__contact-icon--primary">📱</div>
          <div class="card__contact-body">
            <div class="card__contact-label">手機</div>
            <div class="card__contact-value">${person.contact.mobile}</div>
          </div>
          <div class="card__contact-arrow">→</div>
        </a>
      `;
    }

    // 市話
    if (person.contact.phone) {
      html += `
        <a href="tel:${person.contact.phone}" class="card__contact-item">
          <div class="card__contact-icon card__contact-icon--primary">☎️</div>
          <div class="card__contact-body">
            <div class="card__contact-label">市話</div>
            <div class="card__contact-value">${person.contact.phone}</div>
          </div>
          <div class="card__contact-arrow">→</div>
        </a>
      `;
    }

    // Email
    if (person.contact.email) {
      html += `
        <a href="mailto:${person.contact.email}" class="card__contact-item">
          <div class="card__contact-icon card__contact-icon--primary">✉️</div>
          <div class="card__contact-body">
            <div class="card__contact-label">Email</div>
            <div class="card__contact-value">${person.contact.email}</div>
          </div>
          <div class="card__contact-arrow">→</div>
        </a>
      `;
    }

    // 地址
    if (PEOPLE_CONFIG.company.address) {
      html += `
        <a href="https://maps.google.com/?q=${encodeURIComponent(PEOPLE_CONFIG.company.address)}" 
           target="_blank" class="card__contact-item">
          <div class="card__contact-icon card__contact-icon--primary">📍</div>
          <div class="card__contact-body">
            <div class="card__contact-label">地址</div>
            <div class="card__contact-value">${PEOPLE_CONFIG.company.address}</div>
          </div>
          <div class="card__contact-arrow">→</div>
        </a>
      `;
    }

    contacts.innerHTML = html;
  }

  /* ════════════════════════════════════════════
     渲染社群媒體
     ════════════════════════════════════════════ */
  function renderSocial() {
    const person = CURRENT_PERSON;
    const social = document.querySelector('.card__social-grid');
    if (!social) return;

    let html = '';

    const socialLinks = [
      { key: 'line', icon: '💬', label: 'LINE', url: (id) => `https://line.me/ti/p/${id}` },
      { key: 'facebook', icon: '👥', label: 'Facebook', url: (id) => id },
      { key: 'instagram', icon: '📷', label: 'Instagram', url: (id) => `https://instagram.com/${id}` },
      { key: 'linkedin', icon: '💼', label: 'LinkedIn', url: (id) => id },
      { key: 'youtube', icon: '▶️', label: 'YouTube', url: (id) => id },
      { key: 'twitter', icon: '𝕏', label: 'Twitter', url: (id) => id }
    ];

    socialLinks.forEach(link => {
      const value = person.social[link.key];
      if (value) {
        const url = link.url(value);
        html += `
          <a href="${url}" target="_blank" class="card__social-btn card__social-btn--${link.key}" title="${link.label}">
            <span>${link.icon}</span>
            <span>${link.label}</span>
          </a>
        `;
      }
    });

    // 官網
    if (PEOPLE_CONFIG.company.website) {
      html += `
        <a href="${PEOPLE_CONFIG.company.website}" target="_blank" class="card__social-btn card__social-btn--web" title="公司官網">
          <span>🌐</span>
          <span>官網</span>
        </a>
      `;
    }

    social.innerHTML = html;
  }

  /* ════════════════════════════════════════════
     渲染操作按鈕
     ════════════════════════════════════════════ */
  function renderActions() {
    const person = CURRENT_PERSON;
    const actions = document.querySelector('.card__actions');
    if (!actions) return;

    actions.innerHTML = `
      <button class="card__action-btn card__action-btn--primary" id="downloadVCF">
        <span>📥</span>
        <span>加入通訊錄</span>
      </button>
      <button class="card__action-btn card__action-btn--secondary" id="shareCard">
        <span>📤</span>
        <span>分享名片</span>
      </button>
    `;

    // 綁定事件
    document.getElementById('downloadVCF').addEventListener('click', downloadVCF);
    document.getElementById('shareCard').addEventListener('click', shareCard);
  }

  /* ════════════════════════════════════════════
     下載 VCF 通訊錄
     ════════════════════════════════════════════ */
  function downloadVCF() {
    const person = CURRENT_PERSON;
    const company = PEOPLE_CONFIG.company;

    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${person.name.zh}
N:${person.name.zh};;;
ORG:${company.name}
TITLE:${person.title}
TEL;TYPE=CELL:${person.contact.mobile || ''}
TEL;TYPE=WORK:${person.contact.phone || ''}
EMAIL:${person.contact.email || ''}
ADR;TYPE=WORK:;;${company.address || ''}
URL:${company.website || ''}
END:VCARD`;

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${person.name.zh}.vcf`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(`已下載 ${person.name.zh} 的通訊錄`);
  }

  /* ════════════════════════════════════════════
     分享名片
     ════════════════════════════════════════════ */
  function shareCard() {
    const person = CURRENT_PERSON;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: `${person.name.zh} -  科技數位名片`,
        text: `${person.name.zh} (${person.name.en}) - ${person.title}`,
        url: url
      }).catch(err => console.log('分享失敗:', err));
    } else {
      // 複製到剪貼簿
      navigator.clipboard.writeText(url).then(() => {
        showToast('已複製名片連結到剪貼簿');
      });
    }
  }

  /* ════════════════════════════════════════════
     渲染 QR Code
     ════════════════════════════════════════════ */
  function renderQRCode() {
    const qrcodeSection = document.querySelector('.card__qrcode-section');
    if (!qrcodeSection) return;

    const qrcodeWrapper = document.querySelector('.card__qrcode');
    if (!qrcodeWrapper) return;

    // 使用 QR Code API
    const url = window.location.href;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

    qrcodeWrapper.innerHTML = `<img src="${qrApiUrl}" alt="QR Code" style="width: 150px; height: 150px;">`;
  }

  /* ════════════════════════════════════════════
     渲染名片圖片輪播
     ════════════════════════════════════════════ */
  function renderNamecardCarousel() {
    const carousel = document.querySelector('.card__namecard-carousel');
    if (!carousel) return;

    // 由於無法動態列舉資料夾，暫時隱藏
    carousel.setAttribute('hidden', '');
  }

  /* ════════════════════════════════════════════
     渲染頁尾
     ════════════════════════════════════════════ */
  function renderFooter() {
    const footer = document.querySelector('.card__footer');
    if (footer) {
      footer.innerHTML = `
        <p class="card__footer-text">
          © ${new Date().getFullYear()} OmniSyncCard. All rights reserved.
        </p>
      `;
    }
  }

  /* ════════════════════════════════════════════
     Lightbox 功能
     ════════════════════════════════════════════ */
  function showLightbox(imageSrc) {
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      document.body.appendChild(lightbox);
    }

    lightbox.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" title="關閉">✕</button>
        <img src="../${imageSrc}" alt="照片" class="lightbox__img"
             onerror="this.src='https://ui-avatars.com/api/?name=Photo&size=400'">
      </div>
    `;

    lightbox.removeAttribute('hidden');

    lightbox.querySelector('.lightbox__backdrop').addEventListener('click', () => {
      lightbox.setAttribute('hidden', '');
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', () => {
      lightbox.setAttribute('hidden', '');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.setAttribute('hidden', '');
      }
    });
  }

  /* ════════════════════════════════════════════
     Toast 通知
     ════════════════════════════════════════════ */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.removeAttribute('hidden');

    setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 3000);
  }

  /* ════════════════════════════════════════════
     註冊 Service Worker
     ════════════════════════════════════════════ */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const swPath = window.location.pathname.includes('/framework/') 
        ? './service-worker.js' 
        : './framework/service-worker.js';
      navigator.serviceWorker.register(swPath).then(reg => {
        console.log('[PWA] Service Worker 註冊成功:', reg);
      }).catch(err => {
        console.log('[PWA] Service Worker 註冊失敗:', err);
      });
    }
  }

  /* ════════════════════════════════════════════
     設定 PWA
     ════════════════════════════════════════════ */
  function setupPWA() {
    // 更新 manifest.json 中的標題
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) {
      const person = CURRENT_PERSON;
      manifest.href = `../framework/manifest.json?name=${encodeURIComponent(person.name.zh)}`;
    }
  }

  /* ════════════════════════════════════════════
     初始化
     ════════════════════════════════════════════ */
  async function init() {
    try {
      console.log('[Init] 開始初始化...');

      // 載入中央配置
      await loadPeopleConfig();

      // 儫先嘗試從 data 屬性取得職員 ID（用於 WebAPP）
      let personId = document.body.getAttribute('data-person-id');
      console.log('[Init] 從 data 屬性取得:', personId);
      
      // 如果沒有，從路徑提取
      if (!personId) {
        personId = getPersonIdFromPath();
        console.log('[Init] 從路徑提取:', personId);
      }
      
      if (!personId) {
        throw new Error('無法確定職員 ID - 請確保 HTML 有 data-person-id 屬性');
      }
      console.log('[Init] 最終職員 ID:', personId);

      // 載入職員資料
      loadPerson(personId);

      // 更新頁面標題
      document.title = `${CURRENT_PERSON.name.zh} - Hypersonic 數位名片`;

      // 初始化頁面
      applyTheme();
      renderProfile();
      renderContacts();
      renderSocial();
      renderActions();
      renderQRCode();
      renderNamecardCarousel();
      renderFooter();
      registerServiceWorker();
      setupPWA();

      console.log('[Init] 初始化完成!');
    } catch (error) {
      console.error('[Init] 初始化失敗:', error);
      const card = document.querySelector('.card');
      if (card) {
        card.innerHTML = `
          <div style="padding: 40px 20px; text-align: center; color: red;">
            <p><strong>載入失敗</strong></p>
            <p style="font-size: 0.9rem; margin-top: 10px;">${error.message}</p>
            <p style="font-size: 0.8rem; margin-top: 5px; color: #999;">請檢查控制台了解詳情</p>
          </div>
        `;
      }
    }
  }

  /* ════════════════════════════════════════════
     頁面載入完成後初始化
     ════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
