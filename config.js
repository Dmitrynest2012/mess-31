const outsidePosylImages = [
    "img/message-random-1.jpg",
    "img/message-random-2.jpg",
    "img/message-random-3.jpg",
    "img/message-random-4.jpg",
    "img/message-random-5.jpg",
    "img/message-random-6.jpg",
    "img/message-random-7.jpg",
    "img/message-random-8.jpg",
    "img/message-random-9.jpg",
    "img/message-random-10.jpg",
];
const dailyPosylImage = "img/message-base-1.png";
const hourlyPosylImage = "img/message-base-1.png";

const outsideMusic = [
    { src: "music/infinitely.mp3", title: "Infinitely [Keys of Moon]" },
    { src: "music/Ithilien.mp3", title: "Ithilien [Spheriб]" },
    { src: "music/MANTRA.mp3", title: "MANTRA [Alex-Productions]" },
    { src: "music/Spa-Relax.mp3", title: "Spa-Relax [Alex-Productions]" },
    { src: "music/Relaxing-Chill-Music--ARNOR.mp3", title: "Relaxing Chill Music | ARNOR [Alex-Productions]" },
    { src: "music/Fly-Away-When-The-Fog-Settled-Down.mp3", title: "Fly Away When The Fog Settled Down [Spheriá]" },
    { src: "music/Undertow.mp3", title: "Undertow [Scott Buckley]" },
    { src: "music/Don-t-Forget-Me-Alternative-Version-from-2018.mp3", title: "Don't Forget Me (Alternative Version from 2018) [Spheriá]" }
];
const dailyPosylMusic = { src: "music/in_message_music.mp3", title: "Piano Concerto No. 2 in C Minor, Op. 18: II. Adagio sostenuto от Lang Lang. (Валерий Гергиев и Симфонический оркестр Мариинского театра)" };
const hourlyPosylMusic = { src: "music/in_message_music.mp3", title: "Piano Concerto No. 2 in C Minor, Op. 18: II. Adagio sostenuto от Lang Lang. (Валерий Гергиев и Симфонический оркестр Мариинского театра)" };
const bellSound = { src: "sound_of_a_bell_2.wav" };
const notificationSound = { src: "sound_of_notification.mp3" };

// Добавляем после notificationSound
const intervalEndSound = { src: "warning.mp3" };

// Глобальные переменные громкости с дефолтными значениями
window.defaultOutsideVolume = 0.09;
window.defaultPosylVolume = 1.0; // Единая громкость для всех посылов
window.outsideVolume = localStorage.getItem("outsideVolume") !== null ? parseFloat(localStorage.getItem("outsideVolume")) : window.defaultOutsideVolume;
window.posylVolume = localStorage.getItem("posylVolume") !== null ? parseFloat(localStorage.getItem("posylVolume")) : window.defaultPosylVolume; // Заменяем dailyVolume и hourlyVolume

// Глобальные переменные для колокола
window.defaultBellVolume = 1.0;
window.bellEnabled = localStorage.getItem("bellEnabled") !== null ? localStorage.getItem("bellEnabled") === "true" : true;
window.bellVolume = localStorage.getItem("bellVolume") !== null ? parseFloat(localStorage.getItem("bellVolume")) : window.defaultBellVolume;

// Добавляем после bellVolume
window.defaultIntervalEndVolume = 0.0;
window.intervalEndVolume = localStorage.getItem("intervalEndVolume") !== null ? 
    parseFloat(localStorage.getItem("intervalEndVolume")) : 
    window.defaultIntervalEndVolume;