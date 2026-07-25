document.addEventListener("DOMContentLoaded", () => {
    const settingsToggle = document.getElementById("settings-toggle");
    const settingsPopup = document.getElementById("settings-popup");
    const outsideVolumeSlider = document.getElementById("outside-volume");
    const posylVolumeSlider = document.getElementById("posyl-volume");
    const bellToggle = document.getElementById("bell-toggle");
    const bellVolumeSlider = document.getElementById("bell-volume");
    const flameInPosylToggle = document.getElementById("flame-in-posyl");
    const flameOutsidePosylToggle = document.getElementById("flame-outside-posyl");
    const flameVideo = document.getElementById("flame-video");
    const fullscreenToggle = document.getElementById("fullscreen-toggle");
    const intervalEndVolumeSlider = document.getElementById("interval-end-volume");

    // Новый элемент для текста заповедей
    const commandmentsText = document.querySelector(".commandments-text");

    if (!settingsToggle || !settingsPopup || !commandmentsText || !outsideVolumeSlider || !posylVolumeSlider || 
        !bellToggle || !bellVolumeSlider || !flameInPosylToggle || 
        !flameOutsidePosylToggle || !flameVideo || !fullscreenToggle || !intervalEndVolumeSlider) {
        console.error("Не найдены элементы настроек или видео");
        return;
    }

    

    // Функция форматирования текста с учетом символа ^
    function formatCommandmentsText() {
        // Исходный текст (замените на ваш)
        let text = "1. МЫ ВСЕ РАВНЫ ПЕРЕД БОГОМ И НЕТ СРЕДИ НАС ПЕРВЫХ И ПОСЛЕДНИХ;^2. МЫ ЕСМЬ ЕДИНОЕ ДУХОВНОЕ ЦЕЛОЕ;^3. НАС ОБЪЕДИНЯЕТ «ОДНА ЦЕЛЬ» И ПРИНЦИП «ОДИН ЗА ВСЕХ И ВСЕ ЗА ОДНОГО»;^4. МЫ ЕСМЬ ДУХОВНЫЕ УЧИТЕЛЯ СВЕТА ДЛЯ МИРА СЕГО, ИБО ЗНАЕМ «КАК»;^5. МЫ ПРИНИМАЕМ ОТВЕТСТВЕННОСТЬ ЗА СВОЙ ПРОМЫСЕЛ ПЕРЕД БОГОМ И ПЕРЕД ЛЮДЬМИ;^6. МЫ ЕСМЬ В БОГЕ, КАК И БОГ ЕСМЬ В НАС;^7. МЫ ВЕЧНЫ, КАК И ВЕЧНА ВСЕЛЕННАЯ;^8. МЫ ЕДИНЫ С БОГОМ И ПРОМЫСЕЛ БОГА ЕСМЬ НАШ ПРОМЫСЕЛ, КАК И НАШ ПРОМЫСЕЛ ЕСМЬ ПРОМЫСЕЛ БОГА;^9. НЕТ У НАС ИНЫХ БОГОВ, КРОМЕ ТВОРЯЩЕГО НАЧАЛА НАЧАЛ;^10. НАШ ПРОМЫСЕЛ ЕСМЬ ПРОМЫСЕЛ, ПОДЧИНЁННЫЙ КАНОНАМ ВЕЧНОСТИ И СТРУКТУРЕ МИРОЗДАНИЯ!";
        const lines = text.split("^"); // Разбиваем по символу ^
        commandmentsText.innerHTML = lines
            .map(line => `<p>${line.trim()}</p>`) // Оборачиваем каждую строку в <p> и убираем пробелы
            .join("");
    }

    // Вызываем форматирование текста при загрузке
    formatCommandmentsText();

    

    // Инициализация значений ползунков и переключателей
    outsideVolumeSlider.value = window.outsideVolume;
    posylVolumeSlider.value = window.posylVolume;
    bellToggle.checked = window.bellEnabled;
    bellVolumeSlider.value = window.bellVolume;
    bellVolumeSlider.disabled = !window.bellEnabled;
    intervalEndVolumeSlider.value = window.intervalEndVolume;

    window.flameInPosylEnabled = localStorage.getItem("flameInPosylEnabled") === "true";
    window.flameOutsidePosylEnabled = localStorage.getItem("flameOutsidePosylEnabled") === "true";
    flameInPosylToggle.checked = window.flameInPosylEnabled;
    flameOutsidePosylToggle.checked = window.flameOutsidePosylEnabled;

    fullscreenToggle.checked = false;

    // Переключение состояния кнопки и попапа
    let isSettingsActive = false;
    settingsToggle.addEventListener("click", () => {
        isSettingsActive = !isSettingsActive;
        settingsToggle.classList.toggle("active", isSettingsActive);
        settingsToggle.classList.toggle("inactive", !isSettingsActive);
        
        if (isSettingsActive) {
            settingsPopup.style.display = "block";
            setTimeout(() => {
                settingsPopup.classList.add("visible");
            }, 10);
        } else {
            settingsPopup.classList.remove("visible");
            settingsPopup.addEventListener("transitionend", function handler() {
                if (!isSettingsActive) {
                    settingsPopup.style.display = "none";
                }
                settingsPopup.removeEventListener("transitionend", handler);
            });
        }
    });

    document.addEventListener("click", (event) => {
        if (!settingsPopup.contains(event.target) && !settingsToggle.contains(event.target) && isSettingsActive) {
            isSettingsActive = false;
            settingsToggle.classList.remove("active");
            settingsToggle.classList.add("inactive");
            settingsPopup.classList.remove("visible");
            settingsPopup.addEventListener("transitionend", function handler() {
                if (!isSettingsActive) {
                    settingsPopup.style.display = "none";
                }
                settingsPopup.removeEventListener("transitionend", handler);
            });
        }
    });

    // Функция debounce для ограничения частоты вызова
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Обработчики ползунков
    outsideVolumeSlider.addEventListener("input", () => {
        const newValue = parseFloat(outsideVolumeSlider.value);
        localStorage.setItem("outsideVolume", newValue);
        window.outsideVolume = newValue;
    });

    posylVolumeSlider.addEventListener("input", () => {
        const newValue = parseFloat(posylVolumeSlider.value);
        localStorage.setItem("posylVolume", newValue);
        window.posylVolume = newValue;
    });

    bellToggle.addEventListener("change", () => {
        window.bellEnabled = bellToggle.checked;
        localStorage.setItem("bellEnabled", window.bellEnabled);
        bellVolumeSlider.disabled = !window.bellEnabled;
    });

    // Обработчик для bellVolumeSlider с debounce
    const playBellSound = debounce(() => {
        const bellAudio = new Audio(bellSound.src);
        bellAudio.volume = window.bellVolume;
        bellAudio.play();
        notificationAudio.volume = window.bellVolume;
    }, 500); // Звук будет проигрываться не чаще чем раз в 500 мс

    bellVolumeSlider.addEventListener("input", () => {
        const newValue = parseFloat(bellVolumeSlider.value);
        localStorage.setItem("bellVolume", newValue);
        window.bellVolume = newValue;
        playBellSound();
    });

    // Обработчик для intervalEndVolumeSlider с debounce
    const playIntervalEndSound = debounce(() => {
        const testAudio = new Audio(intervalEndSound.src);
        testAudio.volume = window.intervalEndVolume;
        testAudio.play();
    }, 500); // Звук будет проигрываться не чаще чем раз в 500 мс

    intervalEndVolumeSlider.addEventListener("input", () => {
        const newValue = parseFloat(intervalEndVolumeSlider.value);
        localStorage.setItem("intervalEndVolume", newValue);
        window.intervalEndVolume = newValue;
        playIntervalEndSound();
    });

    

    // Логика для полноэкранного режима
    // Логика для полноэкранного режима
fullscreenToggle.addEventListener("change", () => {
    if (fullscreenToggle.checked) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add("fullscreen-compressed");
        }).catch(err => {
            console.error("Ошибка при входе в полноэкранный режим:", err);
            fullscreenToggle.checked = false;
        });
    } else {
        document.exitFullscreen().then(() => {
            document.body.classList.remove("fullscreen-compressed");
        }).catch(err => {
            console.error("Ошибка при выходе из полноэкранного режима:", err);
            fullscreenToggle.checked = true;
        });
    }
});

document.addEventListener("fullscreenchange", () => {
    fullscreenToggle.checked = !!document.fullscreenElement;
    if (document.fullscreenElement) {
        document.body.classList.add("fullscreen-compressed");
    } else {
        document.body.classList.remove("fullscreen-compressed");
    }
});

    function updateFlameVisibility() {
        const shouldBeVisible = (sendStatus === "В Посыле" && window.flameInPosylEnabled) || 
                               (sendStatus === "Вне Посыла" && window.flameOutsidePosylEnabled);
        const wasVisible = flameVideo.classList.contains("visible");
        const wasInPosylPreviously = sendStatus === "В Посыле";

        flameVideo.classList.toggle("visible", shouldBeVisible);

        if (shouldBeVisible) {
            flameVideo.style.display = "block";
            if (typeof updateFlameOpacity === "function") {
                updateFlameOpacity();
            }
            if (hasUserInteracted) {
                flameVideo.play().catch(error => console.error("Ошибка воспроизведения:", error));
            }
        } else {
            flameVideo.pause();
            flameVideo.style.opacity = "0";
            setTimeout(() => {
                if (!flameVideo.classList.contains("visible")) {
                    flameVideo.style.display = "none";
                }
            }, 500);
        }

        const messageContainer = document.querySelector(".message-container");
        if (shouldBeVisible && !wasVisible && messageContainer && sendStatus === "В Посыле") {
            messageContainer.scrollTop += 1;
            setTimeout(() => {
                messageContainer.scrollTop -= 1;
                if (typeof updateFlameOpacity === "function") {
                    updateFlameOpacity();
                }
            }, 100);
        }

        if (shouldBeVisible && sendStatus === "В Посыле" && !wasInPosylPreviously && messageContainer) {
            messageContainer.scrollTop += 1;
            setTimeout(() => {
                messageContainer.scrollTop -= 1;
                if (typeof updateFlameOpacity === "function") {
                    updateFlameOpacity();
                }
            }, 100);
        }
    }

    flameInPosylToggle.addEventListener("change", () => {
        const wasEnabled = window.flameInPosylEnabled;
        window.flameInPosylEnabled = flameInPosylToggle.checked;
        localStorage.setItem("flameInPosylEnabled", window.flameInPosylEnabled);
        updateFlameVisibility();
        if (!wasEnabled && window.flameInPosylEnabled && sendStatus === "В Посыле") {
            const messageContainer = document.querySelector(".message-container");
            if (messageContainer) {
                messageContainer.scrollTop += 1;
                setTimeout(() => {
                    messageContainer.scrollTop -= 1;
                    if (typeof updateFlameOpacity === "function") {
                        updateFlameOpacity();
                    }
                }, 100);
            }
        }
    });

    flameOutsidePosylToggle.addEventListener("change", () => {
        const wasEnabled = window.flameOutsidePosylEnabled;
        window.flameOutsidePosylEnabled = flameOutsidePosylToggle.checked;
        localStorage.setItem("flameOutsidePosylEnabled", window.flameOutsidePosylEnabled);
        updateFlameVisibility();
        if (!wasEnabled && window.flameOutsidePosylEnabled && sendStatus === "Вне Посыла") {
            const messageContainer = document.querySelector(".message-container");
            if (messageContainer) {
                messageContainer.scrollTop += 1;
                setTimeout(() => {
                    messageContainer.scrollTop -= 1;
                    if (typeof updateFlameOpacity === "function") {
                        updateFlameOpacity();
                    }
                }, 100);
            }
        }
    });

    updateFlameVisibility();

    const desktopFontSizeInput = document.getElementById("desktop-font-size");
    const mobileFontSizeInput = document.getElementById("mobile-font-size");
    const fontSizeDecreaseButtons = document.querySelectorAll(".font-size-decrease");
    const fontSizeIncreaseButtons = document.querySelectorAll(".font-size-increase");

    if (!desktopFontSizeInput || !mobileFontSizeInput || !fontSizeDecreaseButtons.length || !fontSizeIncreaseButtons.length) {
        console.error("Не найдены элементы управления размером шрифта");
        return;
    }

    window.desktopFontSize = localStorage.getItem("desktopFontSize") !== null ? parseInt(localStorage.getItem("desktopFontSize")) : 22;
    window.mobileFontSize = localStorage.getItem("mobileFontSize") !== null ? parseInt(localStorage.getItem("mobileFontSize")) : 16;
    desktopFontSizeInput.value = window.desktopFontSize;
    mobileFontSizeInput.value = window.mobileFontSize;

    adjustMessageTextSize();

    desktopFontSizeInput.addEventListener("input", () => {
        let newValue = parseInt(desktopFontSizeInput.value);
        if (isNaN(newValue) || newValue < 16) newValue = 16;
        if (newValue > 40) newValue = 40;
        desktopFontSizeInput.value = newValue;
        window.desktopFontSize = newValue;
        localStorage.setItem("desktopFontSize", newValue);
        adjustMessageTextSize();
    });

    mobileFontSizeInput.addEventListener("input", () => {
        let newValue = parseInt(mobileFontSizeInput.value);
        if (isNaN(newValue) || newValue < 10) newValue = 10;
        if (newValue > 20) newValue = 20;
        mobileFontSizeInput.value = newValue;
        window.mobileFontSize = newValue;
        localStorage.setItem("mobileFontSize", newValue);
        adjustMessageTextSize();
    });

    fontSizeDecreaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);
            let newValue = parseInt(input.value) - 1;
            if (targetId === "desktop-font-size" && newValue >= 16) {
                input.value = newValue;
                window.desktopFontSize = newValue;
                localStorage.setItem("desktopFontSize", newValue);
                adjustMessageTextSize();
            } else if (targetId === "mobile-font-size" && newValue >= 10) {
                input.value = newValue;
                window.mobileFontSize = newValue;
                localStorage.setItem("mobileFontSize", newValue);
                adjustMessageTextSize();
            }
        });
    });

    fontSizeIncreaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);
            let newValue = parseInt(input.value) + 1;
            if (targetId === "desktop-font-size" && newValue <= 40) {
                input.value = newValue;
                window.desktopFontSize = newValue;
                localStorage.setItem("desktopFontSize", newValue);
                adjustMessageTextSize();
            } else if (targetId === "mobile-font-size" && newValue <= 20) {
                input.value = newValue;
                window.mobileFontSize = newValue;
                localStorage.setItem("mobileFontSize", newValue);
                adjustMessageTextSize();
            }
        });
    });

    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const content = section.querySelector('.section-content');
            const isCollapsed = section.classList.contains('section-collapsed');

            content.classList.add('animating');

            if (isCollapsed) {
                section.classList.remove('section-collapsed');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                setTimeout(() => {
                    content.style.maxHeight = '1050px';
                    content.classList.remove('animating');
                }, 400);
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                setTimeout(() => {
                    section.classList.add('section-collapsed');
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    setTimeout(() => {
                        content.classList.remove('animating');
                    }, 400);
                }, 10);
            }

            const sectionTitle = header.querySelector('.section-title').textContent;
            const newCollapsedState = !isCollapsed;
            localStorage.setItem(`section-${sectionTitle}-collapsed`, newCollapsedState);
        });
    });

    document.querySelectorAll('.settings-section').forEach(section => {
        const sectionTitle = section.querySelector('.section-title').textContent;
        const isCollapsed = localStorage.getItem(`section-${sectionTitle}-collapsed`) === 'true';
        const content = section.querySelector('.section-content');
        
        if (isCollapsed) {
            section.classList.add('section-collapsed');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
        } else {
            content.style.maxHeight = '1050px';
            content.style.opacity = '1';
        }

        content.addEventListener('transitionend', () => {
            if (!section.classList.contains('section-collapsed')) {
                content.style.maxHeight = '1050px';
            }
            content.classList.remove('animating');
        });
    });

    // Функция для обновления значения --value
    function updateRangeBackground(slider) {
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--value', value);
    }

    // Инициализация ползунков
    const sliders = [
        outsideVolumeSlider,
        posylVolumeSlider,
        bellVolumeSlider,
        intervalEndVolumeSlider
    ];

    sliders.forEach(slider => {
        updateRangeBackground(slider);
        slider.addEventListener("input", () => {
            updateRangeBackground(slider);
            if (slider === outsideVolumeSlider) {
                const newValue = parseFloat(slider.value);
                localStorage.setItem("outsideVolume", newValue);
                window.outsideVolume = newValue;
            } else if (slider === posylVolumeSlider) {
                const newValue = parseFloat(slider.value);
                localStorage.setItem("posylVolume", newValue);
                window.posylVolume = newValue;
            } else if (slider === bellVolumeSlider) {
                const newValue = parseFloat(slider.value);
                localStorage.setItem("bellVolume", newValue);
                window.bellVolume = newValue;
                playBellSound();
            } else if (slider === intervalEndVolumeSlider) {
                const newValue = parseFloat(slider.value);
                localStorage.setItem("intervalEndVolume", newValue);
                window.intervalEndVolume = newValue;
                playIntervalEndSound();
            }
        });
    });
});