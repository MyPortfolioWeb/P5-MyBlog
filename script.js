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

  // Загрузка страницы с галереей из файла JSON
  function loadGallery() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'gallery.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const content = document.getElementById('content');
        
        let galleryHTML = '<h1>Galería</h1>';
        galleryHTML += '<div class="gallery-row">';

        for (let i = galleryData.photos.length - 1; i >= 0; i--) {
          const photo = galleryData.photos[i];
          galleryHTML += `
            <div class="photo">
              <img src="${photo.image}" alt="${photo.name}">
              <h3>${photo.name}</h3>
              <p>${photo.description}</p>
            </div>`;
        }

        galleryHTML += '</div>';
        content.innerHTML = galleryHTML;
        
        // Открытие всплывающего окна
        const photoElements = document.querySelectorAll('.photo');
        photoElements.forEach(function (photoElement, index) {
          photoElement.addEventListener('click', function () {
            openPopup(index, galleryData.photos);
          });
        });
      }
    };
    xhr.send();
  }

  function openPopup(index, photos) {
    const photo = photos[index];
    const imageSrc = photo.image;
    const imageName = photo.name;
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
      <div class="popup-content">
        <img src="${imageSrc}" alt="Popup Image">
        <h3>${imageName}</h3>
        <button class="close-btn">Cerrar</button>
      </div>
    `;
  
    // Блокировка прокрутки страницы
    document.body.style.overflow = 'hidden';
  
    // Закрытие всплывающего окна при клике на Close
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
            name: imagenameInput.value,
            description: descriptionInput.value
          };

          savePhoto(newPhoto);
          imageInput.value = '';
          imagenameInput.value = '';
          descriptionInput.value = '';
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

    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'gallery.json', true);
    xhr2.onload = function () {
      if (xhr2.status === 200) {
        const galleryData = JSON.parse(xhr2.responseText);
        galleryData.photos.push(photo); // Добавляем новую фотографию в массив photos
        xhr.send(JSON.stringify(galleryData));
      }
    };
    xhr2.send();
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
        photoListHTML += '<div class="gallery-row">';

        for (let i = galleryData.photos.length - 1; i >= 0; i--) {
          const photo = galleryData.photos[i];
          photoListHTML += `
            <div class="photo">
              <img src="${photo.image}" alt="${photo.name}">
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

      const data = {
        photos: [
          {
            index: index,
            name: name
          }
        ]
      };
      xhr.send(JSON.stringify(data));
    }
  };

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

      const data = {
        photos: [
          {
            index: index,
            description: description
          }
        ]
      };

      xhr.send(JSON.stringify(data));
      console.log(data);
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

    const data = {
      index: index
    };

    xhr.send(JSON.stringify(data));
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

// Кнопка вверх для прокрутки страницы сайта в начало
  const btnUp = {
    el: document.querySelector('.btn-up'),
    show() {
      // удалим у кнопки класс btn-up_hide
      this.el.classList.remove('btn-up_hide');
    },
    hide() {
      // добавим к кнопке класс btn-up_hide
      this.el.classList.add('btn-up_hide');
    },
    addEventListener() {
      // при прокрутке содержимого страницы
      window.addEventListener('scroll', () => {
        // определяем величину прокрутки
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
        scrollY > 400 ? this.show() : this.hide();
      });
      // при нажатии на кнопку .btn-up
      document.querySelector('.btn-up').onclick = () => {
        // переместим в начало страницы
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  btnUp.addEventListener();

//прогресс бар
  let line = document.getElementById('progress_line');
  window.addEventListener('scroll', progressBar);
        
  function progressBar(e) {
    let windowScroll = document.body.scrollTop || 
    document.documentElement.scrollTop;
    let windowHeight = document.documentElement.scrollHeight - 
    document.documentElement.clientHeight; 
    let width_progress_line = windowScroll / windowHeight * 100;
    line.style.width = width_progress_line + '%';
  }