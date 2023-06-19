window.addEventListener('load', function () {
  // Добавляем событие загрузки страницы для установки стартовой страницы
  window.location.hash = '#gallery';
  // Загрузка контента на основе хэша в URL
  function loadContent() {
    const hash = window.location.hash.slice(1);
    const content = document.getElementById('content');

    if (hash === 'about') {
      content.innerHTML = `
      <section class="about-section">
      <h2>About Me</h2>
      <div class="author-info">
        <img src="img/My sons and me.jpg" alt="Author Photo" class="author-photo">
        <h3>Viacheslav Fitlin</h3>
        <div class="author-details">
          <p>
          Путешествия — это искусство обнаружения неизведанных миров и ощущение свободы, которое они приносят. Когда мы открываем двери в новые места, мы встречаем невероятные приключения, неповторимую красоту и глубокую историю. И в этом духе, я приглашаю вас отправиться в захватывающее путешествие в экстремадурскую провинцию Испании.
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

  // Загрузка галереи из файла JSON
  function loadGallery() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'gallery.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const content = document.getElementById('content');
        let galleryHTML = '<h1>Gallery</h1>';
        // for (let i = 0; i < galleryData.length; i++) {
        // Изменяем цикл для обратного порядка
        for (let i = galleryData.length - 1; i >= 0; i--) {
          const photo = galleryData[i];
          galleryHTML += `<div class="photo">
          <img src="${photo.image}" alt="${photo.description}">
          <h3>${photo.name}</h3>
          <p>${photo.description}</p>
          </div>`;
        }

        content.innerHTML = galleryHTML;
        //open popup function 
        const photoElements = document.querySelectorAll('.photo');
        photoElements.forEach(function (photoElement) {
          photoElement.addEventListener('click', openPopup);
        });
      }
    };
    xhr.send();
  }

    // Открытие всплывающего окна. действие
  function openPopup() {
    const imageSrc = this.querySelector('img').src;
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
          <img src="${imageSrc}" alt="Popup Image">
          <button class="close-btn">Close</button>
        </div>
      `;
    // Блокировка прокрутки страницы
    document.body.style.overflow = 'hidden';

    // Закрытие всплывающего окна при клике на кнопку Close
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

          const newPhoto = {
            image: imageBase64,
            description: descriptionInput.value,
            name: imagenameInput.value
          };

          savePhoto(newPhoto);
          imageInput.value = '';
          descriptionInput.value = '';
          imagenameInput.value = '';
        };
        reader.readAsDataURL(file);
      }
    });

    loadPhotoList();
  }

  // Сохранение фото в файл JSON
  function savePhoto(photo) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'savephoto.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        loadPhotoList();
      }
    };
    xhr.send(JSON.stringify(photo));
  }

  // Загрузка списка фото на странице Admin
  function loadPhotoList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'gallery.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const photoList = document.getElementById('photoList');
        let photoListHTML = '<h2>Post list</h2>';
        // for (let i = 0; i < galleryData.length; i++) {
        // Изменяем цикл для обратного порядка
        for (let i = galleryData.length - 1; i >= 0; i--) {
          const photo = galleryData[i];
          photoListHTML += `
          <div class="photo">
          <img src="${photo.image}" alt="${photo.description}">
          <h2>${photo.name}</h2>
          <p>${photo.description}</p>
          <button onclick="editName(${i})">Edit Name</button>
          <button onclick="editDescription(${i})">Edit Description</button>
          <button onclick="deletePhoto(${i})">Delete post</button>
          </div>
          `;
        }

        photoList.innerHTML = photoListHTML;
      }
    };
    xhr.send();
  }

  // Редактирование описания фото
  window.editDescription = function (index) {
    const description = prompt("Enter the new description:");
    if (description !== null) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'editdescription.php', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          loadPhotoList();
        }
      };
      xhr.send(JSON.stringify({ index: index, description: description }));
    }
  }

  // Редактирование имени фото
  window.editName = function (index) {
    const name = prompt("Enter the new name:");
    if (name !== null) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'editname.php', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          loadPhotoList();
        }
      };
      xhr.send(JSON.stringify({ index: index, name: name }));
    }
  }

  // Удаление фото на странице Admin
  window.deletePhoto = function (index) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) {
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'deletephoto.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        loadPhotoList();
      }
    };
    xhr.send(JSON.stringify({ index: index }));
  }

  // Показать форму входа
  function showLoginForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
      <h1>Admin Login</h1>
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

  // Инициализация загрузки контента
  loadContent();
});

// Загрузка страницы с галереей
function loadGalleryPage() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'gallery.json', true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const galleryData = JSON.parse(xhr.responseText);
      const content = document.getElementById('content');

      let galleryHTML = '<h2>Gallery</h2>';
      galleryHTML += '<div class="gallery-row">';

      // Изменяем цикл для обратного порядка
      for (let i = galleryData.length - 1; i >= 0; i--) {
        const photo = galleryData[i];
        galleryHTML += `
          <div class="photo" onclick="openPopup('${photo.image}', '${photo.description}')">
            <img src="${photo.image}" alt="${photo.description}">
            <h2>${photo.name}</h2>
            <p>${photo.description}</p>
          </div>
        `;
      }

      galleryHTML += '</div>';

      content.innerHTML = galleryHTML;
    }
  };
  xhr.send();
}

// Вызов функции для загрузки галереи и назначения обработчиков событий
loadGalleryPage();
