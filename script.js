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

          const galleryData = getGalleryData();
          const imageid = galleryData.photos.length.toString();

          const newPhoto = {
            id: imageid,
            image: imageBase64,
            name: imagenameInput.value,
            description: descriptionInput.value
          };

          savePhoto(newPhoto);
          imageid.value = '';
          imageInput.value = '';
          imagenameInput.value = '';
          descriptionInput.value = '';
        };
        reader.readAsDataURL(file);
      }
    });

    loadPhotoList();
  }

    // Загрузка страницы с галереей из файла JSON
  function loadGallery() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'gallery.json', true)
    xhr.onload = function () {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const content = document.getElementById('content');

        // let galleryHTML = '<h1>Galería</h1>';
        // galleryHTML += '<div class="gallery-row">';

        // for (let i = galleryData.photos.length - 1; i >= 0; i--) {
        //   const photo = galleryData.photos[i];
        //   galleryHTML += `
        //   <div class="photo">
        //     <img src="${photo.image}" alt="${photo.name}" onclick="openPopupImage('${photo.image}')">
        //     <h3>${photo.name}</h3>
        //     <p>${photo.description}</p>
        //   </div>`;
        // }

        // galleryHTML += '</div>';
        // content.innerHTML = galleryHTML;

        let mainContent = document.getElementById('content');

        let galleryContainer = document.createElement('div');
        let galleryTitle = document.createElement('h1');
        galleryTitle.textContent = 'Galería';
        galleryContainer.appendChild(galleryTitle);
        
        let galleryRow = document.createElement('div');
        galleryRow.classList.add('gallery-row');
        
        for (let i = galleryData.photos.length - 1; i >= 0; i--) {
          const photo = galleryData.photos[i];
          
          let photoContainer = document.createElement('div');
          photoContainer.classList.add('photo');
          
          let image = document.createElement('img');
          image.src = photo.image;
          image.alt = photo.name;
          image.addEventListener('click', function() {
            openPopupImage(photo.image);
          });
          photoContainer.appendChild(image);
          
          let name = document.createElement('h3');
          name.textContent = photo.name;
          photoContainer.appendChild(name);
          
          let description = document.createElement('p');
          description.textContent = photo.description;
          photoContainer.appendChild(description);
          
          galleryRow.appendChild(photoContainer);
        }
        
        galleryContainer.appendChild(galleryRow);
        mainContent.appendChild(galleryContainer);
        



      }
    };
    xhr.send();
  }
  function openPopupImage(imageSrc) {
    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');
  
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
  
    const popupImage = document.createElement('img');
    popupImage.src = imageSrc;
  
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&#x2716;'; // Знак "✖"
    closeButton.classList.add('popup-close');
    closeButton.addEventListener('click', function () {
      popupOverlay.remove();
    });
  
    popupContent.appendChild(popupImage);
    popupContent.appendChild(closeButton);
  
    popupOverlay.appendChild(popupContent);
  
    document.body.appendChild(popupOverlay);
  }



    // Получение данных галереи из файла JSON
    function getGalleryData() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'gallery.json', false);
      xhr.send();
  
      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      } else {
        return { photos: [] };
      }
    }

  // Сохранение фото в файл JSON
  function savePhoto(photo) {
    const galleryData = getGalleryData();
    const id = galleryData.photos.length.toString();

    const newPhoto = {
      id: photo.id,
      image: photo.image,
      name: photo.name,
      description: photo.description
    };

    galleryData.photos.push(newPhoto);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'savephoto.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        loadPhotoList();
      }
    };
    xhr.send(JSON.stringify(galleryData));
  }

  // Загрузка списка фото на странице Admin
  function loadPhotoList() {
    const galleryData = getGalleryData();
    const photoList = document.getElementById('photoList');
    let photoListHTML = '<h2>Post list</h2>';
    photoListHTML += '<div class="gallery-row">';

    for (let i = galleryData.photos.length - 1; i >= 0; i--) {
      const photo = galleryData.photos[i];
      photoListHTML += `
        <div class="photo">
          <img src="${photo.image}" alt="${photo.name}">
          <h2>id=${photo.id},${photo.name}</h2>
          <p>${photo.description}</p>
          <button onclick="editName(${i})">Edit Name</button>
          <button onclick="editDescription(${i})">Edit Description</button>
          <button onclick="deletePhoto(${i})">Delete post</button>
        </div>
      `;
    }

    photoList.innerHTML = photoListHTML;
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
        photo: {
          id: index.toString(),
          name: name
        }
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
        photo: {
          id: index.toString(),
          description: description
        }
      };
      xhr.send(JSON.stringify(data));
    }
  };

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
  };

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