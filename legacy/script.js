/**
 * G. Hemanth Portfolio - Interactive Logic
 * Features:
 * 1. Multi-Color Palette Theme Switcher (Sunset, Emerald, Ruby, Cyber)
 * 2. Dynamic 60fps Chromatic Fluid Wave Canvas Engine with Cursor Interaction
 * 3. Photo Upload & Custom Avatar Persistence
 * 4. Micro-Interactions: Specular Cursor Spotlight & 3D Tilt on Dark/Light Bento Cards
 * 5. ScrollSpy Navigation Highlighting & Mobile Menu Controls
 */

let currentBgTheme = 'sunset';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Update current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 1. Background Theme Switcher
  // =========================================================================
  const themeButtons = document.querySelectorAll('.bg-theme-btn');
  const savedTheme = localStorage.getItem('hemanth_bg_theme') || 'sunset';

  function applyTheme(themeName) {
    currentBgTheme = themeName;
    document.body.setAttribute('data-bg-theme', themeName);
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    localStorage.setItem('hemanth_bg_theme', themeName);
  }

  // Apply saved theme on startup
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
    });
  });

  // =========================================================================
  // 2. Photo Upload & Persistence
  // =========================================================================
  const photoInput = document.getElementById('customPhotoInput');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const heroImg = document.getElementById('heroProfileImg');
  const avatarImgs = document.querySelectorAll('.brand-avatar-img, .mini-avatar-img');
  const allProfileImgs = document.querySelectorAll('.user-profile-img');
  const defaultPhotoSrc = 'assets/profile.jpg?v=2';
  const defaultAvatarSrc = 'assets/avatar.jpg?v=2';

  // Load custom photo from localStorage if previously uploaded by user
  const savedCustomPhoto = localStorage.getItem('hemanth_custom_photo');
  if (savedCustomPhoto) {
    allProfileImgs.forEach(img => {
      img.src = savedCustomPhoto;
    });
    if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-flex';
  }

  if (photoInput) {
    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const resultDataUrl = e.target.result;
          allProfileImgs.forEach(img => {
            img.src = resultDataUrl;
          });
          try {
            localStorage.setItem('hemanth_custom_photo', resultDataUrl);
          } catch (err) {
            console.warn('Storage quota exceeded, photo previewed in session only.');
          }
          if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (resetPhotoBtn) {
    resetPhotoBtn.addEventListener('click', () => {
      if (heroImg) heroImg.src = defaultPhotoSrc;
      avatarImgs.forEach(img => {
        img.src = defaultAvatarSrc;
      });
      localStorage.removeItem('hemanth_custom_photo');
      resetPhotoBtn.style.display = 'none';
      if (photoInput) photoInput.value = '';
    });
  }

  // =========================================================================
  // 3. Dynamic Fluid Wave Canvas Background Engine
  // =========================================================================
  initFluidWaveCanvas();

  // =========================================================================
  // 4. Mobile Navigation Menu Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) window.lucide.createIcons();
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  // =========================================================================
  // 5. Active Navigation Highlight on Scroll (ScrollSpy)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation, { passive: true });

  // =========================================================================
  // 6. Tactile Specular Spotlight & 3D Tilt on Dual-Theme Bento Cards
  // =========================================================================
  const interactiveCards = document.querySelectorAll('.dark-box, .light-box');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update cursor position for specular radial highlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      if (isFinePointer) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -2.2;
        const rotateY = ((x - centerX) / centerX) * 2.2;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// ===========================================================================
// Dynamic 60fps Chromatic Fluid Wave Canvas Engine
// ===========================================================================
function initFluidWaveCanvas() {
  const canvas = document.getElementById('fluidWaveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse for interactive wave ripples
  let mouse = { x: width * 0.5, y: height * 0.3, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Multi-theme color palettes for fluid ribbons
  const wavePalettes = {
    sunset: [
      { r: 249, g: 115, b: 22,  alpha: 0.28, speed: 0.0010, freq: 0.0016, amp: 85, yBase: 0.32 }, // Tangerine
      { r: 244, g: 63,  b: 94,  alpha: 0.24, speed: 0.0014, freq: 0.0022, amp: 70, yBase: 0.50 }, // Rose coral
      { r: 168, g: 85,  b: 247, alpha: 0.22, speed: 0.0008, freq: 0.0014, amp: 95, yBase: 0.68 }, // Orchid violet
      { r: 245, g: 158, b: 11,  alpha: 0.18, speed: 0.0016, freq: 0.0028, amp: 55, yBase: 0.85 }  // Honey amber
    ],
    emerald: [
      { r: 16,  g: 185, b: 129, alpha: 0.30, speed: 0.0010, freq: 0.0016, amp: 85, yBase: 0.32 }, // Mint emerald
      { r: 132, g: 204, b: 22,  alpha: 0.26, speed: 0.0014, freq: 0.0022, amp: 70, yBase: 0.50 }, // Lime
      { r: 6,   g: 182, b: 212, alpha: 0.24, speed: 0.0008, freq: 0.0014, amp: 95, yBase: 0.68 }, // Cyan
      { r: 234, g: 179, b: 8,   alpha: 0.18, speed: 0.0016, freq: 0.0028, amp: 55, yBase: 0.85 }  // Spring gold
    ],
    ruby: [
      { r: 244, g: 63,  b: 94,  alpha: 0.30, speed: 0.0010, freq: 0.0016, amp: 85, yBase: 0.32 }, // Ruby crimson
      { r: 217, g: 70,  b: 239, alpha: 0.25, speed: 0.0014, freq: 0.0022, amp: 70, yBase: 0.50 }, // Fuchsia
      { r: 245, g: 158, b: 11,  alpha: 0.22, speed: 0.0008, freq: 0.0014, amp: 95, yBase: 0.68 }, // Amber gold
      { r: 251, g: 113, b: 133, alpha: 0.18, speed: 0.0016, freq: 0.0028, amp: 55, yBase: 0.85 }  // Coral rose
    ],
    cyber: [
      { r: 6,   g: 182, b: 212, alpha: 0.32, speed: 0.0010, freq: 0.0016, amp: 85, yBase: 0.32 }, // Cyber cyan
      { r: 236, g: 72,  b: 153, alpha: 0.26, speed: 0.0014, freq: 0.0022, amp: 70, yBase: 0.50 }, // Hot pink
      { r: 163, g: 230, b: 53,  alpha: 0.22, speed: 0.0008, freq: 0.0014, amp: 95, yBase: 0.68 }, // Neon lime
      { r: 139, g: 92,  b: 246, alpha: 0.18, speed: 0.0016, freq: 0.0028, amp: 55, yBase: 0.85 }  // Electric violet
    ]
  };

  // Drifting ambient luminous particles
  const particleCount = 42;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.4 + 0.15
    });
  }

  let time = 0;

  function render() {
    time += 1;
    ctx.clearRect(0, 0, width, height);

    const activePalette = wavePalettes[currentBgTheme] || wavePalettes.sunset;

    // Draw chromatic fluid wave ribbons
    activePalette.forEach((wave, idx) => {
      const baseY = height * wave.yBase;
      const phase = time * wave.speed;

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);

      const step = 16;
      for (let x = 0; x <= width + step; x += step) {
        // Multi-frequency sinusoidal equation
        let y = baseY 
          + Math.sin(x * wave.freq + phase) * wave.amp
          + Math.cos(x * wave.freq * 0.65 - phase * 0.8) * (wave.amp * 0.45);

        // Interactive mouse magnetic displacement
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 260;
          if (dist < maxDist) {
            const factor = Math.cos((dist / maxDist) * (Math.PI / 2));
            y += factor * (idx % 2 === 0 ? 38 : -38);
          }
        }

        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Ribbon gradient fill
      const grad = ctx.createLinearGradient(0, baseY - wave.amp, 0, height);
      grad.addColorStop(0, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${wave.alpha})`);
      grad.addColorStop(0.65, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${(wave.alpha * 0.3).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${wave.r}, ${wave.g}, ${wave.b}, 0)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Top glowing crest line
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        let y = baseY 
          + Math.sin(x * wave.freq + phase) * wave.amp
          + Math.cos(x * wave.freq * 0.65 - phase * 0.8) * (wave.amp * 0.45);

        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 260;
          if (dist < maxDist) {
            const factor = Math.cos((dist / maxDist) * (Math.PI / 2));
            y += factor * (idx % 2 === 0 ? 38 : -38);
          }
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${(wave.alpha * 1.5).toFixed(2)})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    });

    // Draw drifting star-dust particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse gentle nudge
      if (mouse.active) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          p.x += (mdx / mdist) * 0.9;
          p.y += (mdy / mdist) * 0.9;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 235, 255, ${p.alpha.toFixed(2)})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

// ===========================================================================
// Contact Form Submission Mock Handler
// ===========================================================================
window.handleContactSubmit = function () {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  if (!form || !submitBtn || !feedback) return;

  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Sending Message...</span>`;

  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;

    feedback.className = 'form-feedback success';
    feedback.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
    feedback.style.display = 'block';

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5500);
  }, 750);
};
