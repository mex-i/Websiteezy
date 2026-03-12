const videos = [
  {
    title: "2 FOR 1",
    desc: "Main-Projekt",
    src: "assets/videos/2 FOR 1.mp4",
    featured: true,
  },
  {
    title: "4ever",
    desc: "Projektvideo",
    src: "assets/videos/4ever.mp4",
  },
  {
    title: "AyoA 8",
    desc: "Projektvideo",
    src: "assets/videos/AyoA 8.mp4",
  },
  {
    title: "Comp 1_1",
    desc: "Projektvideo",
    src: "assets/videos/Comp 1_1.mp4",
  },
  {
    title: "Krazy",
    desc: "Projektvideo",
    src: "assets/videos/Krazy.mov",
  },
];

const rawShots = [
  "assets/screenshots/Screenshot 2025-07-11 020253.png",
  "assets/screenshots/Screenshot 2025-07-17 030418.png",
  "assets/screenshots/Screenshot 2025-08-26 184012.png",
  "assets/screenshots/Screenshot 2025-08-27 204157.png",
  "assets/screenshots/Screenshot 2025-08-28 204113.png",
  "assets/screenshots/Screenshot 2025-09-01 154801.png",
  "assets/screenshots/Screenshot 2025-09-03 130543.png",
  "assets/screenshots/Screenshot 2025-09-03 221854.png",
  "assets/screenshots/Screenshot 2025-12-31 212454.png",
  "assets/screenshots/Screenshot 2026-02-13 114139.png",
  "assets/screenshots/Screenshot 2026-02-13 114201.png",
  "assets/screenshots/Screenshot 2026-02-13 114220.png",
  "assets/screenshots/Screenshot 2026-02-13 114233.png",
  "assets/screenshots/Screenshot 2026-02-13 114253.png",
  "assets/screenshots/Screenshot 2026-02-13 114336.png",
  "assets/screenshots/Screenshot 2026-02-13 114356.png",
  "assets/screenshots/Screenshot 2026-02-13 114405.png",
  "assets/screenshots/Screenshot 2026-02-13 121136.png",
  "assets/screenshots/Screenshot 2026-02-13 121311.png",
  "assets/screenshots/Screenshot 2026-02-13 121715.png",
];

const programs = [
  "Blender",
  "After Effects",
  "Photoshop",
  "DaVinci Resolve",
  "Illustrator",
  "Houdini",
  "Premiere Pro",
];

const shots = rawShots.map((src, index) => ({
  src,
  program: programs[index % programs.length],
}));

const assetPath = (path) => encodeURI(path);

const videoGrid = document.getElementById("video-grid");
const shotGrid = document.getElementById("shot-grid");
const programTabs = document.getElementById("program-tabs");
const modal = document.getElementById("modal");
const modalMedia = document.getElementById("modal-media");
const closeModal = document.getElementById("close-modal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const sortedVideos = [...videos].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
);

const videoFragment = document.createDocumentFragment();
sortedVideos.forEach((video) => {
  const card = document.createElement("article");
  card.className = `card reveal${video.featured ? " featured" : ""}`;
  card.dataset.video = video.src;

  const encodedSrc = assetPath(video.src);
  card.innerHTML = `
    <div class="thumb">
      <video
        class="thumb-video"
        src="${encodedSrc}"
        muted
        loop
        playsinline
        autoplay
        preload="metadata"
      ></video>
      <div class="play">&#9658;</div>
      ${video.featured ? '<span class="badge">Main</span>' : ""}
    </div>
    <h3>${video.title}</h3>
    <p>${video.desc}</p>
  `;
  videoFragment.appendChild(card);
});
videoGrid.appendChild(videoFragment);

const uniquePrograms = ["Alle", ...programs];
let activeProgram = "Alle";

const renderProgramTabs = () => {
  const tabFragment = document.createDocumentFragment();
  uniquePrograms.forEach((program) => {
    const btn = document.createElement("button");
    btn.className = `program-tab${program === activeProgram ? " active" : ""}`;
    btn.type = "button";

    const count =
      program === "Alle"
        ? shots.length
        : shots.filter((shot) => shot.program === program).length;

    btn.textContent = `${program} (${count})`;
    btn.addEventListener("click", () => {
      activeProgram = program;
      renderProgramTabs();
      renderShots();
    });
    tabFragment.appendChild(btn);
  });

  programTabs.innerHTML = "";
  programTabs.appendChild(tabFragment);
};

const renderShots = () => {
  const shotsFragment = document.createDocumentFragment();
  const filteredShots =
    activeProgram === "Alle"
      ? shots
      : shots.filter((shot) => shot.program === activeProgram);

  filteredShots.forEach((shotData) => {
    const shot = document.createElement("div");
    shot.className = "shot reveal";
    shot.dataset.program = shotData.program;
    shot.innerHTML = `
      <img src="${assetPath(shotData.src)}" alt="${shotData.program} Screenshot" loading="lazy" />
    `;
    shotsFragment.appendChild(shot);
  });

  shotGrid.innerHTML = "";
  shotGrid.appendChild(shotsFragment);
  shotGrid.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
};

renderProgramTabs();
renderShots();

const openVideo = (src) => {
  modalMedia.innerHTML = `<video src="${assetPath(src)}" controls autoplay></video>`;
  modal.classList.add("open");
};

const openImage = (src) => {
  modalMedia.innerHTML = `<img src="${src}" alt="Screenshot" />`;
  modal.classList.add("open");
};

videoGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  openVideo(card.dataset.video);
});

shotGrid.addEventListener("click", (event) => {
  const img = event.target.closest("img");
  if (!img) return;
  openImage(img.src);
});

const closeModalFn = () => {
  modal.classList.remove("open");
  modalMedia.innerHTML = "";
};

closeModal.addEventListener("click", closeModalFn);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModalFn();
});

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

const statNumbers = document.querySelectorAll(".stat-num[data-target]");

const setStatFinal = (el) => {
  const target = Number(el.dataset.target || 0);
  const suffix = el.dataset.suffix || "";
  el.textContent = `${target}${suffix}`;
};

const svgNS = "http://www.w3.org/2000/svg";
let blurDefs = null;
let blurSeed = 0;

const ensureBlurDefs = () => {
  if (blurDefs) return blurDefs;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";

  blurDefs = document.createElementNS(svgNS, "defs");
  svg.appendChild(blurDefs);
  document.body.appendChild(svg);
  return blurDefs;
};

const ensureElementVerticalFilter = (el) => {
  if (el.dataset.vblurFilterId && el._vblurNode) return el._vblurNode;

  const defs = ensureBlurDefs();
  const id = `vblur-${++blurSeed}`;

  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "-20%");
  filter.setAttribute("y", "-40%");
  filter.setAttribute("width", "140%");
  filter.setAttribute("height", "180%");

  const blur = document.createElementNS(svgNS, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", "0 0");

  filter.appendChild(blur);
  defs.appendChild(filter);

  el.dataset.vblurFilterId = id;
  el._vblurNode = blur;
  return blur;
};

const applyVerticalBlur = (el, amount) => {
  const blurNode = ensureElementVerticalFilter(el);

  if (amount <= 0) {
    blurNode.setAttribute("stdDeviation", "0 0");
    el.style.filter = "none";
    return;
  }

  blurNode.setAttribute("stdDeviation", `0 ${amount.toFixed(2)}`);
  el.style.filter = `url(#${el.dataset.vblurFilterId})`;
};

const animateStat = (el, delay) => {
  const target = Number(el.dataset.target || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 820;
  const scrambleRatio = 0.46;
  const start = performance.now() + delay;

  el.classList.add("countup-active");

  const tick = (now) => {
    const elapsed = Math.max(0, now - start);
    const progress = Math.min(1, elapsed / duration);

    if (progress < scrambleRatio) {
      const scrambleProgress = progress / scrambleRatio;
      const randomMax = Math.max(target * 2, 140);
      const randomValue = Math.floor(Math.random() * (randomMax + 1));
      const blurSteps = [12.5, 10.8, 9.2, 7.4, 5.8, 4.2];
      const stepIndex = Math.min(
        blurSteps.length - 1,
        Math.floor(scrambleProgress * blurSteps.length)
      );
      const blur = blurSteps[stepIndex];
      const opacity = 0.9 + Math.random() * 0.1;

      applyVerticalBlur(el, blur);
      el.style.opacity = opacity.toFixed(2);
      el.textContent = `${randomValue}${suffix}`;

      requestAnimationFrame(tick);
      return;
    }

    const settleProgress = (progress - scrambleRatio) / (1 - scrambleRatio);
    const eased = 1 - Math.pow(1 - settleProgress, 5);
    const value = Math.round(target * eased);
    const blur = Math.max(0, (1 - settleProgress) * 4.6);

    applyVerticalBlur(el, blur);
    el.style.opacity = "1";
    el.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setStatFinal(el);
    applyVerticalBlur(el, 0);
    el.style.opacity = "1";
    el.classList.remove("countup-active");
  };

  requestAnimationFrame(tick);
};

const runStats = () => {
  statNumbers.forEach((el, index) => animateStat(el, index * 55));
};

runStats();

videoGrid.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

