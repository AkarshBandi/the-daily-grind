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
  new MutationObserver(function (muts) {
    var needs = false;
    muts.forEach(function (m) { if (m.addedNodes && m.addedNodes.length) needs = true; });
    if (needs) revealAll();
  }).observe(document.body, { childList: true, subtree: true });
})();
