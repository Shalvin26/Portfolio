const posts = document.querySelectorAll('.post');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

posts.forEach(post => observer.observe(post));
