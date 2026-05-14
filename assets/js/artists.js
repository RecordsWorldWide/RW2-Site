/* 
  RW2 - Artists Logic
  Handles Artist Data, Grid Construction, and Panel Details
*/

const ARTISTS = [
  {
    name: 'lyko',
    role: 'Artist',
    country: 'United States',
    id:   '4a4GK5fSd7g9ikiIrr9bGj',
    url:  'https://open.spotify.com/artist/4a4GK5fSd7g9ikiIrr9bGj',
    socials: [
      { type:'ig',  label:'Instagram',  href:'https://instagram.com/ItsLyko' },
      { type:'tt',  label:'TikTok',     href:'https://tiktok.com/@Lil__Lyko' },
      { type:'sc',  label:'SoundCloud', href:'https://soundcloud.com/lil-lolo-480408138' },
    ],
    releases: []
  },
  {
    name: 'zep',
    role: 'Artist',
    country: 'Latvia',
    id:   '0YxYDlhiNqJoC3bBtVCUzc',
    url:  'https://open.spotify.com/artist/0YxYDlhiNqJoC3bBtVCUzc',
    socials: [
      { type:'ig',  label:'Instagram',  href:'https://instagram.com/zepeverywhere' },
      { type:'sc',  label:'SoundCloud', href:'https://soundcloud.com/zepeverywhere/albums' },
    ],
    releases: []
  },
  {
    name: 'radiosurgeryy',
    role: 'Artist',
    country: 'United Kingdom',
    id:   '28EkaMU18bUxqlrriy4WSO',
    url:  'https://open.spotify.com/artist/28EkaMU18bUxqlrriy4WSO',
    socials: [
      { type:'ig',  label:'Instagram',  href:'https://instagram.com/radiosurgeryy' },
      { type:'sc',  label:'SoundCloud', href:'https://soundcloud.com/pasgo45' },
    ],
    releases: []
  },
  {
    name: 'clpz',
    role: 'Producer',
    country: 'Latvia',
    id:   null,
    url:  null,
    scUrl: 'https://soundcloud.com/clpz1',
    socials: [
      { type:'sc', label:'SoundCloud', href:'https://soundcloud.com/clpz1' },
    ],
    releases: []
  }
];

function socialIcon(type) {
  const icons = {
    ig: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    tt: `<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>`,
    sc: `<svg viewBox="0 0 24 24"><path d="M1.175 12.225c-.088 0-.15.06-.163.145l-.213 1.38.213 1.418c.013.09.075.147.163.147.085 0 .15-.06.163-.147l.244-1.418-.244-1.38c-.013-.085-.078-.145-.163-.145zm.93-.705c-.1 0-.178.08-.19.18l-.185 2.085.185 2.078c.012.1.09.178.19.178s.178-.078.19-.178l.21-2.078-.21-2.085c-.012-.1-.09-.18-.19-.18zm.944-.385c-.113 0-.204.09-.216.204l-.16 2.47.16 2.462c.012.113.103.202.216.202s.204-.09.216-.202l.18-2.462-.18-2.47c-.012-.113-.103-.204-.216-.204zm.953-.127c-.125 0-.228.103-.24.228l-.133 2.597.133 2.588c.012.125.115.228.24.228s.228-.103.24-.228l.15-2.588-.15-2.597c-.012-.125-.115-.228-.24-.228zm.963.083c-.138 0-.25.113-.263.25l-.107 2.514.107 2.506c.013.138.125.25.263.25s.25-.113.263-.25l.12-2.506-.12-2.514c-.013-.138-.125-.25-.263-.25zm.974-.277c-.15 0-.275.125-.288.275l-.08 2.79.08 2.78c.013.15.138.276.288.276s.275-.126.288-.276l.09-2.78-.09-2.79c-.013-.15-.138-.275-.288-.275zm.99-.35c-.163 0-.3.138-.313.3l-.053 3.14.053 3.13c.013.163.15.3.313.3s.3-.138.313-.3l.06-3.13-.06-3.14c-.013-.163-.15-.3-.313-.3zm1.007-.13c-.175 0-.325.15-.338.325l-.027 3.27.027 3.258c.013.175.163.325.338.325s.325-.15.338-.325l.03-3.258-.03-3.27c-.013-.175-.163-.325-.338-.325zM12 7.5c-.213 0-.413.04-.6.11-.125-2.838-2.463-5.11-5.325-5.11-1.538 0-2.925.637-3.938 1.663-.25.262-.325.537-.325.8v13.287c0 .563.45 1.025 1.013 1.025h9.175c.563 0 1.013-.463 1.013-1.025V8.513C13.013 7.938 12.563 7.5 12 7.5z"/></svg>`,
    yt: `<svg viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.45a3.02 3.02 0 0 0-2.12 2.14C.05 8.04 0 10.18 0 12s.05 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.45a3.02 3.02 0 0 0 2.12-2.14C23.95 15.96 24 13.82 24 12s-.05-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`,
    sp: `<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
  };
  return icons[type] || icons.sc;
}

async function getArtistImg(artist) {
  if (artist.url) {
    try {
      const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(artist.url)}`);
      if (r.ok) { const d = await r.json(); return d.thumbnail_url || null; }
    } catch(e) {}
  }
  if (artist.scUrl) {
    try {
      const r = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(artist.scUrl)}&format=json`);
      if (r.ok) { const d = await r.json(); return d.thumbnail_url || null; }
    } catch(e) {}
  }
  return null;
}

async function buildCards() {
  const grid = document.getElementById('artists-grid');
  if (!grid || grid.children.length > 0) return;

  const count = ARTISTS.length;
  grid.classList.add(`count-${Math.min(count, 6)}`);

  for (const a of ARTISTS) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-muted);">LOADING...</div>`;
    grid.appendChild(card);
    
    getArtistImg(a).then(img => {
      card.innerHTML = `
        ${img ? `<img src="${img}" alt="${a.name}" loading="lazy"/>` : '<div style="width:100%;height:100%;background:#111"></div>'}
        <div class="artist-card-overlay">
          <div class="artist-name">${a.name}</div>
          <div class="artist-sub">${a.role || 'rw2 collective'}</div>
        </div>
        <div class="artist-arrow">view →</div>`;
      card.onclick = () => openArtistPanel(a);
    });
  }
}

async function openArtistPanel(artist) {
  const panel = document.getElementById('artist-panel');
  const title = document.getElementById('panel-title');
  const body  = document.getElementById('panel-body');
  
  if (!panel || !title || !body) return;

  title.textContent = artist.name;
  body.innerHTML = `<p style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); text-align:center;">PULLING SIGNAL...</p>`;
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';

  const img = await getArtistImg(artist);

  const socialsHtml = [
    ...(artist.url ? [`<a class="social-link sp" href="${artist.url}" target="_blank" rel="noopener" title="Spotify">${socialIcon('sp')}</a>`] : []),
    ...(artist.socials || []).map(s =>
      `<a class="social-link ${s.type}" href="${s.href}" target="_blank" rel="noopener" title="${s.label}">${socialIcon(s.type)}</a>`
    )
  ].join('');

  const embedHtml = artist.url
    ? `<div class="spotify-embed-wrap">
         <iframe
           src="https://open.spotify.com/embed/artist/${artist.id}?utm_source=generator&theme=0"
           width="100%" height="380" frameborder="0"
           allowfullscreen=""
           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
           loading="lazy">
         </iframe>
       </div>`
    : artist.scUrl
    ? `<div class="spotify-embed-wrap">
         <iframe
           width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay"
           src="https://w.soundcloud.com/player/?url=${encodeURIComponent(artist.scUrl)}&color=%23e8000a&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
           loading="lazy">
         </iframe>
       </div>`
    : '';

  body.innerHTML = `
    <div class="panel-artist-hero">
      ${img ? `<img class="panel-artist-img" src="${img}" alt="${artist.name}"/>` : ''}
      <div class="panel-artist-info">
        <h2>${artist.name}</h2>
        <p class="sub">${artist.role || 'rw2 collective'} · ${artist.country || 'worldwide'}</p>
        <div class="social-links">${socialsHtml}</div>
      </div>
    </div>
    ${embedHtml}
  `;
}

function closeArtistPanel() {
  const panel = document.getElementById('artist-panel');
  if (panel) {
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }
}
