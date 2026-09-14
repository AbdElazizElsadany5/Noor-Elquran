const sheikhSelect = document.getElementById("sheikhSelect");
const surahSelect = document.getElementById("surahSelect");
const player = document.getElementById("player");
const quranText = document.getElementById("quranText");
const sheikhSearch = document.getElementById("sheikhSearch");
const surahSearch = document.getElementById("surahSearch");
const darkToggle = document.getElementById("darkToggle");

let allSheikhs = [];
let allSurahs = [];

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      darkToggle.textContent = "الوضع النهاري";
      localStorage.setItem("theme", "dark");
    } else {
      darkToggle.textContent = "الوضع الليلي";
      localStorage.setItem("theme", "light");
    }
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkToggle.textContent = "الوضع النهاري";
  }
}

fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
  .then(res => res.json())
  .then(data => {
    allSheikhs = data.reciters || [];
    renderSheikhs(allSheikhs);
  });

function renderSheikhs(list) {
  if (!sheikhSelect) return;
  sheikhSelect.innerHTML = "";
  list.forEach(sheikh => {
    let option = document.createElement("option");
    option.value = sheikh.id;
    option.textContent = sheikh.name;
    sheikhSelect.appendChild(option);
  });
}

fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    allSurahs = data.data || [];
    renderSurahs(allSurahs);
  });

function renderSurahs(list) {
  if (!surahSelect) return;
  surahSelect.innerHTML = "";
  list.forEach(surah => {
    let option = document.createElement("option");
    option.value = surah.number;
    option.textContent = `${surah.number} - ${surah.name}`;
    surahSelect.appendChild(option);
  });
}

if (sheikhSearch) {
  sheikhSearch.addEventListener("input", () => {
    const v = sheikhSearch.value.toLowerCase();
    renderSheikhs(allSheikhs.filter(s => s.name.toLowerCase().includes(v)));
  });
}

if (surahSearch) {
  surahSearch.addEventListener("input", () => {
    const v = surahSearch.value.toLowerCase();
    renderSurahs(allSurahs.filter(s => s.name.toLowerCase().includes(v)));
  });
}

function loadSurahText(num) {
  if (!quranText) return;
  fetch(`https://api.alquran.cloud/v1/surah/${num}`)
    .then(res => res.json())
    .then(data => {
      quranText.innerHTML = "";
      if (data.data && data.data.ayahs) {
        data.data.ayahs.forEach(a => {
          let p = document.createElement("p");
          p.textContent = a.text;
          quranText.appendChild(p);
        });
      }
    });
}

function playSurah() {
  if (!sheikhSelect || !surahSelect || !player) return;
  const sheikhId = sheikhSelect.value;
  const surahNum = surahSelect.value;
  if (!sheikhId || !surahNum) return;

  fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
    .then(res => res.json())
    .then(data => {
      let sheikh = (data.reciters || []).find(s => s.id == sheikhId);
      if (sheikh && sheikh.moshaf && sheikh.moshaf[0]) {
        let server = sheikh.moshaf[0].server;
        player.src = `${server}${surahNum.toString().padStart(3,"0")}.mp3`;
        player.play().catch(() => {});
        loadSurahText(surahNum);
      }
    });
}

if (sheikhSelect) sheikhSelect.addEventListener("change", playSurah);
if (surahSelect) surahSelect.addEventListener("change", playSurah);
