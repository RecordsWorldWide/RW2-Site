/* 
  RW2 - Player Logic
  Handles Inline and Mini Player Functionality
*/

let playerTracks = [];
let playerIndex = 0;
let playerPlaying = false;
const audio = document.getElementById('player-audio');

async function initPlayer() {
  if (!audio) return;

  let tracks = [];
  try {
    const r = await fetch('/player/manifest.json');
    if (r.ok) tracks = await r.json();
  } catch (e) {
    console.error("Failed to load player manifest", e);
  }

  if (tracks.length > 0) {
    playerTracks = tracks.map(t => ({
      ...t,
      file: t.file.startsWith('/') ? t.file : `/player/${t.file}`,
      cover: t.cover ? (t.cover.startsWith('/') ? t.cover : `/player/${t.cover}`) : null
    }));
  }

  if (!playerTracks.length) return;

  playerIndex = 0;
  loadTrack(0, false);
  setupPlayerObservers();

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    updateProgressUI(pct);
  });

  audio.addEventListener('loadedmetadata', () => {
    const durEl = document.getElementById('ip-dur');
    if (durEl) durEl.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => playerNext());
}

function setupPlayerObservers() {
  const inlinePlayerEl = document.getElementById('inline-player');
  const miniPlayerEl = document.getElementById('music-player');
  
  if (inlinePlayerEl && miniPlayerEl) {
    const ipObs = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      // Show mini player only when inline player is NOT visible
      if (inlinePlayerEl.classList.contains('revealed')) {
        miniPlayerEl.classList.toggle('mini-visible', !visible);
      }
    }, { threshold: 0.1 });
    ipObs.observe(inlinePlayerEl);
  }
}

function updateProgressUI(pct) {
  const miniFill = document.getElementById('player-fill');
  const ipFill = document.getElementById('ip-seek-fill');
  const curTime = document.getElementById('ip-cur');

  if (miniFill) miniFill.style.width = pct + '%';
  if (ipFill) ipFill.style.width = pct + '%';
  if (curTime) curTime.textContent = fmtTime(audio.currentTime);
}

function parseTrackName(t) {
  const raw = (t.title || t.file.split('/').pop().replace(/\.[^.]+$/, ''));
  const parts = raw.split('_');
  if (parts.length >= 2) {
    const artist = parts[parts.length - 1].trim();
    const song = parts.slice(0, parts.length - 1).join(' ').trim();
    return { song, artist };
  }
  return { song: raw.trim(), artist: 'RW2' };
}

function fmtTime(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function loadTrack(idx, autoplay) {
  if (!playerTracks.length) return;
  const t = playerTracks[idx];
  audio.src = t.file;
  audio.load();

  const { song, artist } = parseTrackName(t);

  // Update Mini Player
  const miniArt = document.getElementById('player-art');
  const miniName = document.getElementById('player-name');
  const miniSub = document.getElementById('player-sub');
  
  if (miniArt) {
    miniArt.innerHTML = t.cover ? `<img src="${t.cover}" alt="cover"/>` : `<div style="background:#222; width:100%; height:100%;"></div>`;
  }
  if (miniName) miniName.textContent = song.toUpperCase();
  if (miniSub) miniSub.textContent = `${artist} · ${idx + 1} / ${playerTracks.length}`;

  // Update Inline Player
  const ipTitle = document.getElementById('ip-title');
  const ipMeta = document.getElementById('ip-meta');
  const ipCoverWrap = document.getElementById('ip-cover-wrap');
  
  if (ipTitle) ipTitle.textContent = song.toUpperCase();
  if (ipMeta) ipMeta.textContent = `${artist} · RW2 COLLECTIVE`;
  
  if (ipCoverWrap) {
    const oldImg = ipCoverWrap.querySelector('img');
    if (oldImg) oldImg.remove();
    if (t.cover) {
      const img = document.createElement('img');
      img.src = t.cover;
      img.alt = song;
      ipCoverWrap.insertBefore(img, ipCoverWrap.firstChild);
    }
  }

  if (autoplay || playerPlaying) {
    audio.play().then(() => setPlayState(true)).catch(e => console.warn("Autoplay blocked", e));
  } else {
    setPlayState(false);
  }
}

function setPlayState(playing) {
  playerPlaying = playing;
  
  // Update icons
  const miniPlay = document.getElementById('icon-play');
  const miniPause = document.getElementById('icon-pause');
  const ipPlay = document.getElementById('ip-icon-play');
  const ipPause = document.getElementById('ip-icon-pause');
  const vinyl = document.getElementById('ip-vinyl');

  if (miniPlay) miniPlay.style.display = playing ? 'none' : '';
  if (miniPause) miniPause.style.display = playing ? '' : 'none';
  if (ipPlay) ipPlay.style.display = playing ? 'none' : '';
  if (ipPause) ipPause.style.display = playing ? '' : 'none';
  if (vinyl) vinyl.classList.toggle('spinning', playing);
}

function playerToggle() {
  if (!playerTracks.length) return;
  if (audio.paused) {
    audio.play().then(() => setPlayState(true)).catch(() => {});
  } else {
    audio.pause();
    setPlayState(false);
  }
}

function playerNext() {
  if (!playerTracks.length) return;
  playerIndex = (playerIndex + 1) % playerTracks.length;
  loadTrack(playerIndex, true);
}

function playerPrev() {
  if (!playerTracks.length) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  playerIndex = (playerIndex - 1 + playerTracks.length) % playerTracks.length;
  loadTrack(playerIndex, true);
}

function playerSeek(e) {
  if (!audio.duration) return;
  const bar = document.getElementById('ip-seek') || e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

// Handle seek bar clicking for mini player too
const miniProgress = document.getElementById('player-progress');
if (miniProgress) {
  miniProgress.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = miniProgress.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });
}
