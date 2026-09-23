// Edit-mode guard — disables heavy scroll/animations in Tina iframe and re-reveals swapped islands
(function () {
  var isEdit = false;
  try { isEdit = window.self !== window.top; } catch (e) { isEdit = true; }
  if (!isEdit && document.querySelector('[data-tina-form]')) isEdit = true;
  if (!isEdit) return;
  document.documentElement.classList.add('is-tina-edit');
  document.body.classList.add('is-tina-edit');
  function revealAll() {
    document.querySelectorAll('.tina-hidden, [style*="opacity: 0"]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    // Ensure menuTabs panels all visible in editor
    document.querySelectorAll('.block-menutabs .menutabs-panels > article').forEach(function (el) {
      el.style.display = '';
    });
  }
  revealAll();
  // Fallback for TinaCloud staging images that 404 — use local public copy
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.src && t.src.indexOf('assets.tina.io') !== -1) {
      var local = t.src.split('/__file/').pop();
      if (local) {
        local = '/' + local.replace(/^\/+/, '');
        // shots are under /shots/, images under /images/
        if (local.indexOf('/shots/') === -1 && local.indexOf('/images/') === -1) {
          local = '/shots/' + local.split('/').pop();
        }
        t.onerror = null;
        t.src = local;
      }
    }
  }, true);
  new MutationObserver(function (muts) {
    var needs = false;
    muts.forEach(function (m) { if (m.addedNodes && m.addedNodes.length) needs = true; });
    if (needs) revealAll();
  }).observe(document.body, { childList: true, subtree: true });
})();
