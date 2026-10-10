(function () {
  'use strict';

  var key = 'edmundhong:theme';
  var root = document.documentElement;
  var device = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  try {
    var saved = window.localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (error) {
    // A blocked storage area must not prevent switching themes.
  }

  function applyTheme() {
    var theme = preference || (device.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    var color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = theme === 'dark' ? '#20231f' : '#f7f4ec';
    if (button) {
      var label = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }

  // This script runs in the head before the stylesheet and first paint.
  applyTheme();

  function followDevice() {
    if (!preference) applyTheme();
  }
  if (device.addEventListener) device.addEventListener('change', followDevice);
  else device.addListener(followDevice);

  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    applyTheme();
  });

  document.addEventListener('DOMContentLoaded', function () {
    button = document.querySelector('.theme-toggle');
    if (!button) return;
    applyTheme();
    button.hidden = false;
    button.addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try {
        window.localStorage.setItem(key, preference);
      } catch (error) {
        // Keep the manual choice for this page when storage is unavailable.
      }
    });
  });
}());
