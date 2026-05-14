/* 
  RW2 - Main Logic
  Handles Site Lifecycle, Loader, and Entry Morph
*/

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
});

function initLoader() {
  const loader = document.getElementById('loader');
  const entry = document.getElementById('entry');
  const ewRW2 = document.getElementById('ew-rw2');
  const ewEnter = document.getElementById('ew-enter');

  // Initial state for entry words
  if (ewRW2) {
    ewRW2.style.opacity = '1';
    ewRW2.style.filter = 'blur(0px)';
    ewRW2.style.transform = 'translateX(-50%)';
  }
  if (ewEnter) {
    ewEnter.style.opacity = '0.003';
    ewEnter.style.filter = 'blur(40px)';
    ewEnter.style.transform = 'translateX(-50%)';
  }

  document.body.style.overflow = 'hidden';

  // Fade out loader after a delay
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.classList.add('gone');
      if (entry) {
        entry.classList.add('visible');
        initEntryMorph();
      }
    }, 1000);
  }, 2000);
}

function initEntryMorph() {
  const wrap = document.getElementById('entry-morph');
  const ewRW2 = document.getElementById('ew-rw2');
  const ewEnter = document.getElementById('ew-enter');
  
  if (!wrap || !ewRW2 || !ewEnter) return;

  let hovering = false;
  let animId = null;
  let progress = 0;
  const SPEED = 0.02;

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function animate() {
    if (hovering && progress < 1) {
      progress = Math.min(progress + SPEED, 1);
    } else if (!hovering && progress > 0) {
      progress = Math.max(progress - SPEED, 0);
    } else {
      animId = null;
      return;
    }

    const p = smoothstep(progress);
    ewRW2.style.opacity = String(1 - p * (1 - 0.003));
    ewRW2.style.filter = `blur(${p * 40}px)`;
    ewEnter.style.opacity = String(0.003 + p * (1 - 0.003));
    ewEnter.style.filter = `blur(${(1 - p) * 40}px)`;

    animId = requestAnimationFrame(animate);
  }

  wrap.addEventListener('mouseenter', () => {
    hovering = true;
    if (!animId) animId = requestAnimationFrame(animate);
  });

  wrap.addEventListener('mouseleave', () => {
    hovering = false;
    if (!animId) animId = requestAnimationFrame(animate);
  });
}

function enterSite() {
  const entry = document.getElementById('entry');
  const homepage = document.getElementById('homepage');
  const ewRW2 = document.getElementById('ew-rw2');
  const ewEnter = document.getElementById('ew-enter');
  const mw2 = document.getElementById('mw2');
  const mw1 = document.getElementById('mw1');

  if (!entry || !homepage || !ewRW2 || !mw2) return;

  // 1. Prepare homepage (hidden but rendered to measure target)
  homepage.style.opacity = '0';
  homepage.style.pointerEvents = 'none';
  homepage.classList.add('visible');
  
  // Reset morph words state for transition
  mw2.style.opacity = '1';
  mw2.style.filter = 'none';
  mw2.style.transform = 'translateX(-50%) scaleX(1)';
  mw1.style.opacity = '0';
  mw1.style.filter = 'none';
  mw1.style.transform = 'translateX(-50%) scaleX(1)';

  requestAnimationFrame(() => {
    // 2. Measure positions
    const srcRect = ewRW2.getBoundingClientRect();
    const srcCX = srcRect.left + srcRect.width / 2;
    const srcCY = srcRect.top + srcRect.height / 2;

    const tgtRect = mw2.getBoundingClientRect();
    const tgtCX = tgtRect.left + tgtRect.width / 2;
    const tgtCY = tgtRect.top + tgtRect.height / 2;

    const srcFontPx = parseFloat(getComputedStyle(ewRW2).fontSize);
    
    // 3. Create flying clone
    const clone = document.createElement('span');
    clone.textContent = 'RW2';
    clone.style.cssText = `
      position: fixed;
      left: ${srcCX}px;
      top:  ${srcCY}px;
      font-family: var(--font-bebas);
      font-size: ${srcFontPx}px;
      letter-spacing: .04em;
      color: var(--text-color);
      white-space: nowrap;
      pointer-events: none;
      z-index: 9999;
      transform-origin: center center;
      transform: translate(-50%, -50%);
      opacity: 1;
      will-change: transform, opacity;
    `;
    document.body.appendChild(clone);

    const cloneW = clone.offsetWidth;
    const cloneH = clone.offsetHeight;
    const scaleX = tgtRect.width / cloneW;
    const scaleY = tgtRect.height / cloneH;
    const dx = tgtCX - srcCX;
    const dy = tgtCY - srcCY;

    // 4. Start transition
    ewRW2.style.opacity = '0';
    mw2.style.opacity = '0';
    entry.classList.add('fade-out');

    requestAnimationFrame(() => {
      clone.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
      clone.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scaleX}, ${scaleY})`;

      setTimeout(() => {
        homepage.style.transition = 'opacity 0.6s ease';
        homepage.style.opacity = '1';
        homepage.style.pointerEvents = 'all';
        document.body.style.overflow = '';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 300);

      setTimeout(() => {
        mw2.style.opacity = '1';
        clone.style.opacity = '0';
        setTimeout(() => {
          clone.remove();
        }, 300);
        
        // Start the homepage morph animation
        startHomeMorph('rw2');
        
        // Populate and reveal other components
        if (typeof buildCards === 'function') buildCards();
        if (typeof initPlayer === 'function') initPlayer();
        
        const inlinePlayer = document.getElementById('inline-player');
        if (inlinePlayer) inlinePlayer.classList.add('revealed');
      }, 800);
    });

    setTimeout(() => entry.classList.add('gone'), 1500);
  });
}

function startHomeMorph(startWord) {
  const mw1 = document.getElementById('mw1');
  const mw2 = document.getElementById('mw2');
  if (!mw1 || !mw2) return;

  const HOLD = 3000;
  const TRANS = 1500;
  let t0 = performance.now();
  let showing = (startWord === 'rw2') ? 2 : 1;

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function frame(now) {
    const e = now - t0;
    if (e < HOLD) {
      const cur = showing === 1 ? mw1 : mw2;
      const other = showing === 1 ? mw2 : mw1;
      cur.style.opacity = '1';
      cur.style.filter = 'blur(0px)';
      other.style.opacity = '0.003';
      other.style.filter = 'blur(40px)';
    } else {
      const raw = Math.min((e - HOLD) / TRANS, 1);
      const p = smoothstep(raw);
      const from = showing === 1 ? mw1 : mw2;
      const to = showing === 1 ? mw2 : mw1;

      from.style.opacity = String(1 - p * (1 - 0.003));
      from.style.filter = `blur(${p * 40}px)`;
      to.style.opacity = String(0.003 + p * (1 - 0.003));
      to.style.filter = `blur(${(1 - p) * 40}px)`;

      if (e > HOLD + TRANS) {
        showing = showing === 1 ? 2 : 1;
        t0 = now;
      }
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// UI Panel helpers
function openForm() {
  const form = document.getElementById('form-panel');
  if (form) {
    form.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeForm() {
  const form = document.getElementById('form-panel');
  if (form) {
    form.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeForm();
    if (typeof closeArtistPanel === 'function') closeArtistPanel();
  }
});
