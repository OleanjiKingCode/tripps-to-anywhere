// ── Tripps to Anywhere · "Add to home screen" banner ──────────
// Chrome on Android fires beforeinstallprompt once the site can be installed.
// We hold that event and show our own banner. "Not now" hides it for 14 days.

(() => {
  const KEY = 'tripps-install-dismissed';
  const QUIET_DAYS = 14;
  let deferred = null;

  const dismissedRecently = () => {
    try {
      const at = Number(localStorage.getItem(KEY));
      return at > 0 && Date.now() - at < QUIET_DAYS * 864e5;
    } catch { return false; }
  };
  const remember = () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch {}
  };

  const css = `
    #installBar{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:60;max-width:440px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:12px;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:18px;box-shadow:0 12px 40px rgba(13,31,35,.22);font-family:var(--sans);transform:translateY(calc(100% + 32px));opacity:0;transition:transform .35s cubic-bezier(.2,.8,.2,1),opacity .35s}
    #installBar.in{transform:none;opacity:1}
    #installBar img{width:48px;height:48px;border-radius:12px;flex:none}
    #installBar p{flex:1;min-width:0;font-size:13.5px;line-height:1.35}
    #installBar strong{display:block;font-family:var(--serif);font-weight:400;font-size:16px}
    #installBar span{color:var(--rock)}
    #installBar .ib-add{padding:10px 20px;border:0;border-radius:999px;background:var(--deep);color:var(--paper);font:600 14px var(--sans);cursor:pointer;flex:none}
    #installBar .ib-add:hover{background:var(--teal)}
    #installBar .ib-close{width:32px;height:32px;border:0;border-radius:50%;background:none;color:var(--rock);font-size:22px;line-height:1;cursor:pointer;flex:none}
    #installBar .ib-close:hover{background:var(--line)}
    @media(prefers-reduced-motion:reduce){#installBar{transition:none}}
  `;

  const hide = (bar) => {
    bar.classList.remove('in');
    setTimeout(() => bar.remove(), 400);
  };

  const show = () => {
    if (document.getElementById('installBar')) return;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'installBar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Add to home screen');
    bar.innerHTML = `
      <img src="icon-maskable-192.png?v=4" alt="" width="48" height="48">
      <p><strong>Tripps to Anywhere</strong><span>Add the app to your home screen?</span></p>
      <button type="button" class="ib-add">Add</button>
      <button type="button" class="ib-close" aria-label="Not now">&times;</button>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('in')));

    bar.querySelector('.ib-add').addEventListener('click', async () => {
      hide(bar);
      if (!deferred) return;
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      if (outcome === 'dismissed') remember();
    });
    bar.querySelector('.ib-close').addEventListener('click', () => {
      remember();
      hide(bar);
    });
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    if (dismissedRecently()) return;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show, { once: true });
    else show();
  });

  window.addEventListener('appinstalled', () => {
    deferred = null;
    const bar = document.getElementById('installBar');
    if (bar) hide(bar);
  });
})();
