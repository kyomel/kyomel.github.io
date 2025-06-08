/**
 * Theme Switcher for Portfolio Website
 * Handles switching between light and dark mode
 */
(function() {
  "use strict";

  // Check for saved theme preference or use system preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check if user prefers dark mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button icon
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o';
      themeIcon.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  // Initialize theme on page load
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const savedTheme = getThemePreference();
    applyTheme(savedTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  });
})();
