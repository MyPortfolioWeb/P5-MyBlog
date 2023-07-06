// Загрузка контента на основе хэша в URL
function loadContent() {
  const hash = window.location.hash.slice(1);
  const content = document.getElementById("content");
  // Если хэш пустой, устанавливаем значение "about" по умолчанию
  const defaultHash = hash === "" ? "about" : hash;
  if (defaultHash === "about") {
    content.innerHTML = `
      <section class="about-section">
      <h2>Bienvenido, soy Slava y me gustaría enseñarte algo...</h2>
      <div class="author-info">
        <img src="mi photo.png" alt="Author Photo" class="author-photo">
        <div class="author-details">
          <p>
          ¿Has experimentado alguna vez la sensación de descubrir mundos desconocidos y la libertad que traen consigo? Cuando abrimos las puertas a nuevos lugares, nos encontramos con aventuras increíbles, belleza incomparable y una historia profunda. En ese espíritu, te invito a embarcarte en un emocionante viaje a la provincia de Extremadura, ubicada en el suroeste de España.<br>
          Extremadura es una joya que muchos aún desconocen. Adéntrate valientemente en sus antiguas calles, donde cada piedra está impregnada de historia y cultura. Te esperan castillos, ruinas misteriosas y paisajes pintorescos que inspirarán tu alma.<br>
          ¿Y qué hay de los descubrimientos culinarios? Extremadura es famosa por su gastronomía, y no puedes dejar de probar sus exquisitos platos. Los deliciosos quesos, el famoso jamón ibérico y los vinos locales son auténticos manjares.<br>
          Los viajes a Extremadura despertarán en ti la sed de descubrimiento y aventura. Sin duda, tendrás que superar tus límites, pero son precisamente esos momentos los que dejan impresiones inolvidables en la memoria. Abre tu corazón y tu alma a Extremadura y descubrirás una nueva profundidad e inspiración en tu vida.<br>
          ¡Vamos a buscar de nuevos mundos y revelaciones en España!
            </p>
          </div>
        </div>
      </section>
      `;
  } else if (defaultHash === "gallery") {
    loadGallery();
  } else if (defaultHash === "admin") {
    if (isLoggedIn()) {
      loadAdmin();
    } else {
      showLoginForm();
    }
  } else {
    content.innerHTML = "<h1>Welcome</h1><p>This is the homepage.</p>";
  }
}

const apiURL = "https://freezing-peridot-bag.glitch.me/photos";
// Загрузка страницы gallery из файла JSON
async function loadGallery() {
  //функция получения данных из файла json
  let res = await fetch(apiURL, {
    //запрос с ожиданием
    method: "GET",
  });

  if (!res.ok) {
    let message = "Error: " + res.status;
    console.log(message);
  }
  let result = await res.json(); //трансформацию в формат js

  let content = document.getElementById("content");
  let galleryHTML =
    '<h2>"Extremadura: ¡Descubre nuevas fronteras y aventuras!"</h2>';
  galleryHTML += '<div class="gallery-row">';
  for (let i = result.length - 1; i >= 0; i--) {
    let photo = result[i];
    galleryHTML += `
          <div class="photo">
          <img src="${photo.image}" alt="${photo.name}">
          <h3>${photo.name}</h3>
          <p>${photo.description}</p>
          </div>`;
  }
  galleryHTML += "</div>";
  content.innerHTML = galleryHTML;

  // Добавление класса для стилизации скрытых фотографий
  const photoElements = document.querySelectorAll(".photo");
  photoElements.forEach(function (photoElement, index) {
    //open popup function
    photoElement.addEventListener("click", openPopup);
    if (index >= 4) {
      photoElement.classList.add("hidden");
    }
  });
  // Отслеживание прокрутки страницы
  window.addEventListener("scroll", handleScroll);

  function handleScroll() {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight / 2) {
      // Показывать следующие скрытые фотографии
      showHiddenPhotos();
    }
  }
  function showHiddenPhotos() {
    const hiddenPhotos = document.querySelectorAll(".photo.hidden");
    hiddenPhotos.forEach(function (photoElement, index) {
      if (index < 4) {
        photoElement.classList.remove("hidden");
      }
    });

    // Удаление обработчика прокрутки, если все фотографии отображены
    if (hiddenPhotos.length <= 4) {
      window.removeEventListener("scroll", handleScroll);
    }
  }
}

// Открытие всплывающего окна. действие
function openPopup() {
  const imageSrc = this.querySelector("img").src;
  const imageNane = this.querySelector("img").alt;
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
        <div class="popup-content">
          <img src="${imageSrc}" alt="Popup Image">
          <h3>${imageNane}</h3>
          <button class="close-btn">&#x2716;</button>
        </div>
      `;
  // Блокировка прокрутки страницы
  document.body.style.overflow = "hidden";

  // Закрытие всплывающего окна при клике на "✖"
  const closeBtn = popup.querySelector(".close-btn");
  closeBtn.addEventListener("click", function () {
    document.body.removeChild(popup);

    // Разблокировка прокрутки страницы
    document.body.style.overflow = "auto";
  });

  // Закрытие всплывающего окна при клике на окно
  popup.addEventListener("click", function (event) {
    // Проверяем, что клик был на самом окне, а не внутри его содержимого
    if (event.target === popup) {
      document.body.removeChild(popup);

      // Разблокировка прокрутки страницы
      document.body.style.overflow = "auto";
    }
  });

  document.body.appendChild(popup);
}

// Загрузка списка фото на странице Admin
async function loadPhotoList() {
  //функция получения данных из файла json
  let res = await fetch(apiURL, {
    //запрос с ожиданием
    method: "GET",
  });

  if (!res.ok) {
    let message = "Error: " + res.status;
    console.log(message);
  }
  let result = await res.json(); //трансформацию в формат js

  const photoList = document.getElementById("photoList");
  let photoListHTML = "<h2>Post list</h2>";
  photoListHTML += '<div class="gallery-row">';
  // for (let i = 0; i < galleryData.length; i++) {
  // Изменяем цикл для обратного порядка
  for (let i = result.length - 1; i >= 0; i--) {
    const photo = result[i];

    photoListHTML += `
            <div class="photo">
            <img src="${photo.image}" alt="${photo.name}">
            <h3>name:${photo.name}</h3>
            <p>id:${photo.id}</p>
            <p>${photo.description}</p>
            <button onclick="editName('${photo.id}')">Edit Name</button>
            <button onclick="editDescription('${photo.id}')">Edit Description</button>
            <button onclick="deletePhoto('${photo.id}')">Delete post</button>
            </div>
            `;

    photoList.innerHTML = photoListHTML;
  }
}

// Загрузка страницы Admin
function loadAdmin() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h1>Admin</h1>
      <form id="addPhotoForm">
        <input type="file" name="image" accept="image/*" required>
        <input type="text" name="name" placeholder="Name" required>
        <input type="text" name="description" placeholder="Description" required>
        <button type="submit">Add new post</button>
      </form>
      <div id="photoList"></div>
    `;

  const addPhotoForm = document.getElementById("addPhotoForm");
  addPhotoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const imageInput = addPhotoForm.elements.image;
    const descriptionInput = addPhotoForm.elements.description;
    const imagenameInput = addPhotoForm.elements.name;

    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const imageBase64 = e.target.result;

        const newPhoto = {
          image: imageBase64,
          description: descriptionInput.value,
          name: imagenameInput.value,
        };

        try {
          const response = await axios.post(`${apiURL}`, newPhoto); // Отправляем POST-запрос на сервер с новой фотографией
          console.log('New photo added:', response.data);
        } catch (error) {
          console.error('Error adding new photo:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  loadPhotoList();
}



//функция editName, которая изменяет имя фото по индексу
window.editName = async function editName(id) {
  const name = prompt("Enter the new name:");
  if (name !== null) {
    const newName = { name: name };
    try {
      await axios.patch(`${apiURL}/${id}`, newName);
      console.log(`Photo with id ${id} has been updated.`);
      loadPhotoList(); // Обновление списка фотографий после изменения имени
    } catch (error) {
      console.error(`Error updating photo with id ${id}:`, error);
    }
  }
};

//функция editDescription, которая изменяет описание фото по индексу
window.editDescription = async function editDescription(id) {
  const description = prompt("Enter the new description:");
  if (description !== null) {
    const newDescription = { description: description };
    await axios.patch(`${apiURL}/${id}`, newDescription);
  }
  loadPhotoList(); // Перезагрузка списка фото после удаления
};

//функция удаления фото из массива db.json
window.deletePhoto = async function deletePhoto(id) {
  const confirmed = confirm("Are you sure you want to delete this photo?");
  if (confirmed) {
    try {
      await axios.delete(`${apiURL}/${id}`);
      console.log(`Photo with id ${id} has been deleted.`);
      loadPhotoList(); // Перезагрузка списка фото после удаления
    } catch (error) {
      console.error(`Error deleting photo with id ${id}:`, error);
    }
  }
};


// Показать форму входа
function showLoginForm() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <h1>Admin Login</h1>
        <div class="login-container">
        <form id="loginForm">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Log In</button>
        </form>
      `;

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = loginForm.elements.username;
    const passwordInput = loginForm.elements.password;

    if (login(usernameInput.value, passwordInput.value)) {
      loadAdmin();
    } else {
      alert("Invalid username or password");
    }

    usernameInput.value = "";
    passwordInput.value = "";
  });
}

// Проверка авторизации
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

// Вход в систему
function login(username, password) {
  // Простая проверка, здесь нужно использовать безопасный механизм аутентификации
  if (username === "admin" && password === "password") {
    localStorage.setItem("loggedIn", "true");
    return true;
  }

  return false;
}

// Выход из системы
function logout() {
  localStorage.setItem("loggedIn", "false");
  window.location.hash = "";
}

// Обработка изменений хэша в URL
window.addEventListener("hashchange", loadContent);

// Инициализация загрузки контента
loadContent();

// Кнопка вверх для прокрутки страницы сайта в начало
const btnUp = {
  el: document.querySelector(".btn-up"),
  show() {
    // удалим у кнопки класс btn-up_hide
    this.el.classList.remove("btn-up_hide");
  },
  hide() {
    // добавим к кнопке класс btn-up_hide
    this.el.classList.add("btn-up_hide");
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener("scroll", () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку .btn-up
    document.querySelector(".btn-up").onclick = () => {
      // переместим в начало страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };
  },
};

btnUp.addEventListener();

//прогресс бар
let line = document.getElementById("progress_line");
window.addEventListener("scroll", progressBar);

function progressBar(e) {
  let windowScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  let windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let width_progress_line = (windowScroll / windowHeight) * 100;
  line.style.width = width_progress_line + "%";
}
