/**
 * Portfolio filtering functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all filter buttons and portfolio items
  const filterButtons = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  // Add click event to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter items
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        // Show/hide items based on filter
        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Create a placeholder image for portfolio items
  function createPlaceholderImage() {
    const placeholders = document.querySelectorAll('img[src="assets/img/portfolio-placeholder.jpg"]');
    
    if (placeholders.length > 0) {
      placeholders.forEach((img, index) => {
        // Create different colored placeholders for different items
        const colors = ['3a8f7f', '5bb5a6', '4a9f8f'];
        const color = colors[index % colors.length];
        
        // Set placeholder image from placeholder.com service
        img.src = `https://via.placeholder.com/600x400/${color}/FFFFFF?text=Portfolio+Project`;
      });
    }
  }
  
  // Call the function to create placeholders
  createPlaceholderImage();
});
