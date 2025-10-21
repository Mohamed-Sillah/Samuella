const countdown = () => {
  const galleryslider = document.getElementById("galleryslider");
  const galleryh2 = document.getElementById("galleryh2");
  const videos = document.getElementById("videos");
  const share = document.getElementById("share");
  const musicBtn = document.getElementById("musicBtn");
  const flipcard = document.getElementById("flip-card-section");
  const wish = document.getElementById("wish");
  const header1 = document.getElementById("header1");
  const header2 = document.getElementById("header2");
  const ccountdown = document.getElementById("ccountdown");
  const birthday = new Date('2025-10-21T19:57:00.100Z'); 
  const h31 = document.getElementById("h31");
  const h32 = document.getElementById("h32");
  const now = new Date();
  const timeLeft = birthday - now;
  const messageboard = document.getElementById("message-board");
  const countdownSection = document.getElementById("countdown");
  const footer = document.querySelector(".copyright-text")
  
  
  if (timeLeft < 0) {
    countdownSection.style.marginTop = "30px"
    galleryslider.style.display = "block";
    galleryh2.style.display = "block";
    videos.style.display = "block";
    share.style.display = "block";
    musicBtn.style.display = "block";
    flipcard.style.display = "block";
    messageboard.style.display = "block";
    
    // 🔥 EMERGENCY GALLERY FIX
    h32.style.display = "flex";
    h31.style.display = "none";
    wish.style.display = "flex";
    ccountdown.style.display = "none";
    header2.style.display = "block";
    header1.style.display = "none";
    document.getElementById('timer').style.display = "none";
    
    
    // 🎉 Trigger Confetti Animation Once
    if (!hasConfettiFired) {
      fireConfetti();
      hasConfettiFired = true;
    }
    
    return;
  } else {
    header1.style.display = "block";
    header2.style.display = "none";
    footer.style.textAlign = "center";
  }
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById('timer').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  document.getElementById('timer').style.fontWeight = "bolder";
}

// Flag for confetti (like hasAutoPlayed)
let hasConfettiFired = false;

// Confetti Function (15-second burst)
function fireConfetti() {
  const duration = 10 * 1000; // 10 seconds
  const end = Date.now() + duration;

  (function frame() {
    // Launch from left
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    // Launch from right
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

let hasAutoPlayed = false;
const countdownInterval = setInterval(countdown, 1000);
countdown();

// 💌 Message Board
const messageForm = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  if (name && message) {
  document.getElementById("submit-btn").innerText = "Sending...";
  fetch('https://bdayserver-krib.onrender.com/wishes', {
    method: "POST",
    body: JSON.stringify({ name, message }),
    headers: {
      "Content-Type": "application/json",
    },
  }) 
    .then(res => {document.getElementById("submit-btn").innerText = "Send Wish"; return res.json()})
    .then(data => {
      if(data) messagesDiv.innerHTML = "";
      data?.forEach(wish => {
          if (wish.name && wish.message) {
          const msgElement = document.createElement("p");
          msgElement.innerHTML = `<strong>${wish.name}:</strong> ${wish.message}`;
          messagesDiv.prepend(msgElement);
        }
      });
    });
    messageForm.reset();
  }
});
// 🎵 Music Button with Fade Effects
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;
const fadeDuration = 2000; // 2 seconds
const fadeSteps = 20; // Smooth steps
const fadeInterval = fadeDuration / fadeSteps;

function fadeIn(audio) {
  audio.volume = 0;
  audio.play().then(() => {
    let vol = 0;
    const interval = setInterval(() => {
      vol += 1 / fadeSteps;
      if (vol >= 1) {
        vol = 1;
        clearInterval(interval);
      }
      audio.volume = vol;
    }, fadeInterval);
  }).catch(error => {
    console.error('Play error:', error);
  });
}

function fadeOut(audio, callback) {
  let vol = audio.volume;
  const interval = setInterval(() => {
    vol -= 1 / fadeSteps;
    if (vol <= 0) {
      vol = 0;
      clearInterval(interval);
      audio.pause();
      if (callback) callback();
    }
    audio.volume = vol;
  }, fadeInterval);
}

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    fadeOut(music, () => {
      musicBtn.innerHTML = '<span>🎵 Play Music</span>';
    });
  } else {
    fadeIn(music);
    musicBtn.innerHTML = '<span>⏸ Pause Music</span>';
  }
  isPlaying = !isPlaying;
});

// 📤 Share Button
const shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Happy Birthday Ella 🎂",
      text: "Celebrate Ella's special day with us!",
      url: window.location.href,
    });
  } else {
    alert("Sharing not supported on this device.");
  }
});

// 📹 Video Slideshow
let currentSlide = 0;
let slideshowInterval;
const totalSlides = 8;
let isSlideshowPlaying = true;

const videos = document.querySelectorAll(".video-slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevVideo");
const nextBtn = document.getElementById("nextVideo");
const playPauseBtn = document.getElementById("playPause");

function showSlide(index) {
  videos.forEach(video => video.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));
  videos[index].classList.add("active");
  dots[index].classList.add("active");
  currentSlide = index;
  videos.forEach(video => { video.pause(); video.currentTime = 0; });
  videos[index].play();
}

function startSlideshow() {
  slideshowInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 25000);
}

nextBtn.addEventListener("click", () => {
  clearInterval(slideshowInterval);
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
  if (isSlideshowPlaying) startSlideshow();
});

prevBtn.addEventListener("click", () => {
  clearInterval(slideshowInterval);
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
  if (isSlideshowPlaying) startSlideshow();
});

playPauseBtn.addEventListener("click", () => {
  isSlideshowPlaying = !isSlideshowPlaying;
  playPauseBtn.textContent = isSlideshowPlaying ? "⏸" : "▶";
  if (isSlideshowPlaying) startSlideshow();
  else clearInterval(slideshowInterval);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    clearInterval(slideshowInterval);
    showSlide(index);
    if (isSlideshowPlaying) startSlideshow();
  });
});

showSlide(0);
startSlideshow();

// 🖼️ Gallery Slider - FIXED!
const slides = document.querySelectorAll(".slides img");
let slideIndex = 0;
let intervalid = null;

document.addEventListener("DOMContentLoaded", () => {
  if (slides.length > 0) {
    slides[slideIndex].classList.add("displaySlide");
    intervalid = setInterval(nextSlide, 5000);
    console.log("🖼️ Gallery slider initialized!"); 
  }
});

function showSlideImg(index) {
  if (index >= slides.length) slideIndex = 0;
  else if (index < 0) slideIndex = slides.length - 1;
  slides.forEach(slide => slide.classList.remove("displaySlide"));
  slides[slideIndex].classList.add("displaySlide");
}

function prevSlide() {
  clearInterval(intervalid);
  slideIndex--;
  showSlideImg(slideIndex);
  intervalid = setInterval(nextSlide, 5000);
}

function nextSlide() {
  clearInterval(intervalid);
  slideIndex++;
  showSlideImg(slideIndex);
  intervalid = setInterval(nextSlide, 5000);
}

fetch('https://bdayserver-krib.onrender.com/wishes') 
  .then(res => res.json())
  .then(data => {
    data?.forEach(wish => {
        if (wish.name && wish.message) {
        const msgElement = document.createElement("p");
        msgElement.innerHTML = `<strong>${wish.name}:</strong> ${wish.message}`;
        messagesDiv.prepend(msgElement);
      }
    });
  })
