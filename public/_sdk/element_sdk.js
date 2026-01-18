// Minimal stub for Lovable-exported Element SDK.
// The billing.source.html includes this for the original platform runtime.
// For standalone deployment we only need the functions it calls.
(function () {
  if (window.elementSdk) return;

  const noop = () => {};

  window.elementSdk = {
    // some exports check for init existence
    init: async () => ({ isOk: true }),

    // called by settings panel wiring
    setConfig: noop,

    // visual editor hooks (safe no-ops)
    registerEditPanel: noop,
    showEditPanel: noop,
    hideEditPanel: noop,

    isOk: true,
  };
})();
