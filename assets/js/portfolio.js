document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  var portfolioCards = document.querySelectorAll('.portfolio-card-modern');

  if (filterButtons.length === 0 || portfolioCards.length === 0) return;

  portfolioCards.forEach(function (card) {
    card.style.transition =
      'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)';
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      var filterValue = this.getAttribute('data-filter');

      portfolioCards.forEach(function (card) {
        var category = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === category) {
          card.style.display = '';
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85) translateY(20px)';
          setTimeout(function () {
            card.style.display = 'none';
          }, 350);
        }
      });
    });
  });
});
