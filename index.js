document.addEventListener("DOMContentLoaded", () => {
  // Правильный пин и переменная для ввода
  const correctPin = "0301";
  let currentPin = "";
  const openedApps = { reasons: false, photos: false, mail: false };

  // Функция переключения экранов
  function switchScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  }

  // Обновление визуальных точек пина
  function updatePinDots() {
    const dots = document.querySelectorAll(".pin-dot");
    dots.forEach((dot, index) => {
      if (index < currentPin.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    });
  }

  // Очистка ввода пина
  function clearPin() {
    currentPin = "";
    updatePinDots();
  }

  // Проверка пина
  function checkPin() {
    if (currentPin === correctPin) {
      switchScreen("home-screen");
      clearPin();
    } else {
      const pinContainer = document.querySelector(".pin-container");
      pinContainer.classList.add("shake");
      setTimeout(() => {
        pinContainer.classList.remove("shake");
        clearPin();
      }, 500);
    }
  }

  // Обработчики для кнопок пин-кода
  document.querySelectorAll(".pin-button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("pin-button-clear")) {
        clearPin();
      } else if (btn.classList.contains("pin-button-enter")) {
        checkPin();
      } else {
        if (currentPin.length < 4) {
          currentPin += btn.getAttribute("data-num");
          updatePinDots();
        }
      }
    });
  });

  // Функция обновления времени и даты
  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    const timeElem = document.getElementById("time");
    const homeTimeElem = document.getElementById("home-time");
    if (timeElem) timeElem.textContent = timeString;
    if (homeTimeElem) homeTimeElem.textContent = timeString;

    const dateElem = document.getElementById("date");
    if (dateElem) {
      const days = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
      ];
      const months = [
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря"
      ];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      dateElem.textContent = `${dayName}, ${day} ${month}`;
    }
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Обработка нажатий на иконки приложений на домашнем экране
  document.querySelectorAll("#home-screen .app").forEach(app => {
    app.addEventListener("click", () => {
      const appName = app.getAttribute("data-app");
      if (appName === "reasons") {
        openedApps.reasons = true;
        checkUnlocked();
        switchScreen("reasons-app");
      } else if (appName === "photos") {
        openedApps.photos = true;
        checkUnlocked();
        switchScreen("photos-app");
      } else if (appName === "mail") {
        openedApps.mail = true;
        checkUnlocked();
        switchScreen("mail-app");
      } else if (appName === "locked") {
        // Если иконка разблокирована, показываем открытую версию
        const lockedIcon = app.querySelector("i");
        if (lockedIcon.classList.contains("fa-unlock")) {
          switchScreen("locked-app-screen");
          showUnlockedLockedScreen();
        } else {
          switchScreen("locked-app-screen");
          showLockedLockedScreen();
        }
      }
    });
  });

  // Проверка, открыты ли все обязательные приложения
  function checkUnlocked() {
    if (openedApps.reasons && openedApps.photos && openedApps.mail) {
      const lockedApp = document.getElementById("locked-app");
      if (lockedApp) {
        const icon = lockedApp.querySelector("i");
        icon.classList.remove("fa-lock");
        icon.classList.add("fa-unlock");
        lockedApp.querySelector(".app-label").textContent = "Открыто";
      }
    }
  }

  // Отображение экрана "закрыто"
  function showLockedLockedScreen() {
    document.getElementById("locked-content").style.display = "flex";
    document.getElementById("unlocked-content").style.display = "none";
  }

  // Отображение экрана "открыто" с анимацией цветов
  function showUnlockedLockedScreen() {
    document.getElementById("locked-content").style.display = "none";
    document.getElementById("unlocked-content").style.display = "flex";
    // Первоначальный запуск водопада
    spawnFlowers();
    // Если интервал ещё не запущен, запускаем его для постоянного водопада
    if (!window.waterfallInterval) {
      window.waterfallInterval = setInterval(spawnFlowers, 1000);
    }
  }
  

  // Кнопки "назад" возвращают на предыдущий экран
  document.querySelectorAll(".back-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const currentScreen = document.querySelector(".screen.active").id;
      if (currentScreen === "locked-app-screen") {
        if (window.waterfallInterval) {
          clearInterval(window.waterfallInterval);
          window.waterfallInterval = null;
        }
        switchScreen("home-screen");
      } else if (currentScreen === "mail-view") {
        switchScreen("mail-app");
      } else if (currentScreen === "photo-view") {
        switchScreen("photos-app");
      } else {
        switchScreen("home-screen");
      }
    });
  });
  

  // Функционал для почты: открытие сообщения
  document.querySelectorAll(".mail-item").forEach(item => {
    item.addEventListener("click", () => {
      const mailId = item.getAttribute("data-mail");
      const mailData = {
        "1": {
          subject: "обожаю",
          sender: "твой котик",
          email: "catlover2009@email.com",
          message:
            "я думаю ты должна понимать что я тебя обожаю всем сердцем"
        },
        "2": {
          subject: "Еще одно признание",
          sender: "твой егорка",
          email: "catlover2009@email.com",
          message:
            "Я хочу признаться тебе еще в одном. Мои чувства безграничны!"
        },
        "3": {
          subject: "Важное сообщение",
          sender: "Егор",
          email: "catlover2009@email.com",
          message:
            "У меня есть очень важное сообщение для тебя. Ты – моя вселенная!"
        }
      };
      const data = mailData[mailId] || mailData["1"];
      document.getElementById("mail-subject-full").textContent = data.subject;
      document.querySelector(".sender-name-full").textContent = data.sender;
      document.querySelector(".sender-email").textContent = data.email;
      const mailMessage = document.getElementById("mail-message");
      mailMessage.classList.remove("active");
      mailMessage.textContent = data.message;
      switchScreen("mail-view");
    });
  });

  // При нажатии на конверт в почте открывается сообщение
  const envelope = document.getElementById("envelope");
  if (envelope) {
    envelope.addEventListener("click", () => {
      document.getElementById("mail-message").classList.add("active");
    });
  }

  // Функционал для фотографий: открытие полноэкранного просмотра
  document.querySelectorAll(".photo-item").forEach(item => {
    item.addEventListener("click", () => {
      const photoId = item.getAttribute("data-photo");
      document.getElementById("full-photo-img").src = `/api/placeholder/300/300?photo=${photoId}`;
      const descriptions = {
        "1": "Описание фото 1: Это момент радости.",
        "2": "Описание фото 2: Прекрасное воспоминание.",
        "3": "Описание фото 3: Особый момент.",
        "4": "Описание фото 4: Нежность и любовь.",
        "5": "Описание фото 5: Радость и счастье.",
        "6": "Описание фото 6: Луч света в темноте.",
        "7": "Описание фото 7: Улыбка, которая озаряет всё.",
        "8": "Описание фото 8: Воспоминание о лете.",
        "9": "Описание фото 9: Тепло наших сердец.",
        "10": "Описание фото 10: Момент, полный любви."
      };
      document.getElementById("photo-description-text").textContent =
        descriptions[photoId] || "Описание фото";
      switchScreen("photo-view");
    });
  });

  // Функция для создания плавающих сердечек
  function spawnHeart() {
    const heartsContainers = document.querySelectorAll(".floating-hearts");
    heartsContainers.forEach(container => {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.innerHTML = "&#10084;";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.bottom = "0"; // сердечки появляются снизу
  
      // Если контейнер принадлежит экрану блокировки, то с вероятностью 30% создать большое сердце
      if (container.closest("#lock-screen") && Math.random() < 0.3) {
        heart.style.fontSize = (Math.random() * 30 + 50) + "px"; // от 50 до 80px
        heart.style.animationDuration = Math.random() * 4 + 4 + "s";
      } else {
        heart.style.fontSize = Math.random() * 20 + 10 + "px";
        heart.style.animationDuration = Math.random() * 3 + 3 + "s";
      }
  
      container.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, parseFloat(heart.style.animationDuration) * 1000);
    });
  }
  
  
  

  // Функция для создания анимации цветов в открытом приложении "Закрыто/Открыто"
  function spawnFlowers() {
    const container = document.querySelector("#unlocked-content .flower-animation");
    if (!container) return;
    // Можно не очищать контейнер, чтобы анимации накладывались
    for (let i = 0; i < 5; i++) { // меньше элементов за цикл для плавности
      const heart = document.createElement("div");
      heart.classList.add("waterfall-heart");
      heart.innerHTML = "&#10084;";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.top = "0";
      heart.style.fontSize = Math.random() * 30 + 20 + "px";
      heart.style.animationDuration = Math.random() * 2 + 3 + "s";
      container.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, parseFloat(heart.style.animationDuration) * 1000);
    }
  }
  
  
});