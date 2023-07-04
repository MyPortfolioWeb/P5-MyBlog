window.addEventListener('load', function () {
  // Добавляем событие загрузки страницы для установки стартовой страницы
  window.location.hash = '#about';

  // Загрузка контента на основе хэша в URL
  function loadContent() {
    const hash = window.location.hash.slice(1);
    const content = document.getElementById('content');
    if (hash === 'about') {
      content.innerHTML = `
      <section class="about-section">
      <h2>Bienvenido, soy Slava y me gustaría enseñarte algo...</h2>
      <div class="author-info">
        <img src="img/mi photo.png" alt="Author Photo" class="author-photo">
        <div class="author-details">
          <p>
          bla bla bla...
            </p>
          </div>
        </div>
      </section>
      `;

    } else if (hash === 'gallery') {
      loadGallery();
    } else if (hash === 'admin') {
      if (isLoggedIn()) {
        loadAdmin();
      } else {
        showLoginForm();
      }
    } else {
      content.innerHTML = '<h1>Welcome</h1><p>This is the homepage.</p>';
    }
  }


  const apiURL = 'http://localhost:3000/photos';
  // Загрузка страницы gallery из файла JSON
  async function loadGallery() {                //функция получения данных из файла json
    let res = await fetch(apiURL, {         //запрос с ожиданием
      method: 'GET',
    });

    if (!res.ok) {
      let message = 'Error: ' + res.status;
      console.log(message);
    }
    let result = await res.json();        //трансформацию в формат js

    let content = document.getElementById('content');
    let galleryHTML = '<h2>"Extremadura: ¡Descubre nuevas fronteras y aventuras!"</h2>';
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
    galleryHTML += '</div>';
    content.innerHTML = galleryHTML;
    
      // Добавление класса для стилизации скрытых фотографий
    const photoElements = document.querySelectorAll('.photo');
    photoElements.forEach(function (photoElement, index) {
      //open popup function
      photoElement.addEventListener('click', openPopup);
      if (index >= 4) {
        photoElement.classList.add('hidden');
      }
    });
    // Отслеживание прокрутки страницы
    window.addEventListener('scroll', handleScroll);

      function handleScroll() {
        const scrollPosition = window.innerHeight + window.pageYOffset;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= (pageHeight / 2)) {
          // Показывать следующие скрытые фотографии
          showHiddenPhotos();
        }
      }
    function showHiddenPhotos() {
      const hiddenPhotos = document.querySelectorAll('.photo.hidden');
      hiddenPhotos.forEach(function (photoElement, index) {
        if (index < 4) {
          photoElement.classList.remove('hidden');
        }
      });

      // Удаление обработчика прокрутки, если все фотографии отображены
      if (hiddenPhotos.length <= 4) {
        window.removeEventListener('scroll', handleScroll);
      }
    }

  

  }


  // Открытие всплывающего окна. действие
  function openPopup() {
    const imageSrc = this.querySelector('img').src;
    const imageNane = this.querySelector('img').alt;
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
          <img src="${imageSrc}" alt="Popup Image">
          <h3>${imageNane}</h3>
          <button class="close-btn">&#x2716;</button>
        </div>
      `;
    // Блокировка прокрутки страницы
    document.body.style.overflow = 'hidden';

    // Закрытие всплывающего окна при клике на "✖"
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', function () {
      document.body.removeChild(popup);

      // Разблокировка прокрутки страницы
      document.body.style.overflow = 'auto';
    });

    // Закрытие всплывающего окна при клике на окно
    popup.addEventListener('click', function (event) {
      // Проверяем, что клик был на самом окне, а не внутри его содержимого
      if (event.target === popup) {
        document.body.removeChild(popup);

        // Разблокировка прокрутки страницы
        document.body.style.overflow = 'auto';
      }
    });

    document.body.appendChild(popup);
  }

   // Загрузка списка фото на странице Admin

   async function loadPhotoList() {                //функция получения данных из файла json
    let res = await fetch(apiURL, {         //запрос с ожиданием
      method: 'GET',
    });

    if (!res.ok) {
      let message = 'Error: ' + res.status;
      console.log(message);
    }
    let result = await res.json();        //трансформацию в формат js


    const photoList = document.getElementById('photoList');
    let photoListHTML = '<h2>Post list</h2>';
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
            <button onclick="editName(event, ${i})">Edit Name</button>
            <button onclick="editDescription(${i})">Edit Description</button>
            <button onclick="deletePhoto(${i})">Delete post</button>
            </div>
            `;

      photoList.innerHTML = photoListHTML;
    }
  }


  // Загрузка страницы Admin
  function loadAdmin() {
    const content = document.getElementById('content');
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

    const addPhotoForm = document.getElementById('addPhotoForm');
    addPhotoForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const imageInput = addPhotoForm.elements.image;
      const descriptionInput = addPhotoForm.elements.description;
      const imagenameInput = addPhotoForm.elements.name;

      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageBase64 = e.target.result;


          async function add() {
            const response = await axios.get(apiURL); // Получаем список всех фотографий

            const photos = response.data; // Массив фотографий
            const newIndex = photos.length; // Новый индекс будет равен длине массива (следующий доступный индекс)

            const newPhoto = {
              "id": newIndex,
              "image": imageBase64,
              "description": descriptionInput.value,
              "name": imagenameInput.value
            };

            await axios.post(apiURL, newPhoto); // Отправляем новую фотографию на сервер
          }
          add();

        };
        reader.readAsDataURL(file);
      }
    });
    loadPhotoList();
  }


 

  //функция editName, которая изменяет имя фото по индексу
  window.editName = async function editName(event, index) {
    event.preventDefault(); // Отключаем перезагрузку страницы
    const name = prompt("Enter the new name:");
    if (name !== null) {
      const newName = { "name": name };
      await axios.patch(`${apiURL}/${index}`, newName);
      //loadPhotoList(); // Обновление списка фотографий после изменения имени
    }
  }

  //функция editDescription, которая изменяет описание фото по индексу
  window.editDescription = async function editDescription(index) {
    const description = prompt("Enter the new description:");
    if (description !== null) {
      const newDescription = { "description": description };
      await axios.patch(`${apiURL}/${index}`, newDescription);
    }
  }

  //функция удаления фото из массива db.json

  window.deletePhoto = async function deletePhoto(index) {
    const confirmed = confirm("Are you sure you want to delete this photo?");
    if (confirmed) {
      try {
        await axios.delete(`${apiURL}/${index}`);
        console.log(`Photo with id ${index} has been deleted.`);
        //loadPhotoList(); // Перезагрузка списка фото после удаления
      } catch (error) {
        console.error(`Error deleting photo with id ${index}:`, error);
      }
    }
    // loadGallery();
  }


  // Показать форму входа
  function showLoginForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>Admin Login</h1>
        <div class="login-container">
        <form id="loginForm">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Log In</button>
        </form>
      `;

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const usernameInput = loginForm.elements.username;
      const passwordInput = loginForm.elements.password;

      if (login(usernameInput.value, passwordInput.value)) {
        loadAdmin();
      } else {
        alert('Invalid username or password');
      }

      usernameInput.value = '';
      passwordInput.value = '';
    });
  }

  // Проверка авторизации
  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  // Вход в систему
  function login(username, password) {
    // Простая проверка, здесь нужно использовать безопасный механизм аутентификации
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('loggedIn', 'true');
      return true;
    }

    return false;
  }

  // Выход из системы
  function logout() {
    localStorage.setItem('loggedIn', 'false');
    window.location.hash = '';
  }


  // Обработка изменений хэша в URL
  window.addEventListener('hashchange', loadContent);

})