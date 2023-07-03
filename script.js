window.addEventListener('load', function () {
  // Добавляем событие загрузки страницы для установки стартовой страницы
  window.location.hash = '#about';

  const apiURL = 'http://localhost:3000/photos';

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
      // if (isLoggedIn()) {
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
      // for (let i = 0; i < galleryData.length; i++) {
      // Изменяем цикл для обратного порядка
      for (let i = result.length - 1; i >= 0; i--) {
      let photo = result[i];
      galleryHTML += `
        <div class="photo">
        <img src="${photo.image}" alt="${photo.name}">
        <h3>${photo.name}</h3>
        <p>${photo.description}</p>
        </div>`;
      }

        content.innerHTML = galleryHTML;

    }





    //   const xhr = new XMLHttpRequest();
    //   xhr.open('GET', 'db.json', true);       //Откройте соединение, указав метод запроса и URL-адрес:
    //   xhr.onload = function () {
    //     if (xhr.status === 200) {
    //       const dbData = JSON.parse(xhr.responseText);    //получеем данные из Json и преобразуем в объект JS
    //       const photosArray = dbData.photos;              //берем массив из обекта

    //       const content = document.getElementById('content');
    //               let galleryHTML = '<h2>"Extremadura: ¡Descubre nuevas fronteras y aventuras!"</h2>';
    //       galleryHTML += '<div class="gallery-row">';
    //       // for (let i = 0; i < galleryData.length; i++) {
    //       // Изменяем цикл для обратного порядка
    //       for (let i = photosArray.length - 1; i >= 0; i--) {
    //         const photo = photosArray[i];
    //         galleryHTML += `
    //           <div class="photo">
    //           <img src="${photo.image}" alt="${photo.name}">
    //           <h3>${photo.name}</h3>
    //            <p>${photo.description}</p>
    //           </div>`;
    //       }

    //       content.innerHTML = galleryHTML;
    //       //open popup function 
    //       // const photoElements = document.querySelectorAll('.photo');
    //       // photoElements.forEach(function (photoElement) {
    //       //   photoElement.addEventListener('click', openPopup);
    //       // });

    //     } else {
    //       // Обработка ошибки
    //       console.error('Ошибка при выполнении запроса. Статус:', xhr.status);
    //     }
    //   };
    //   xhr.send();             //Отправьте запрос на сервер:
    // }
    


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
          <h3>${photo.name}</h3>
          <p>${photo.description}</p>
          <button onclick="editName(${i})">Edit Name</button>
          <button onclick="editDescription(${i})">Edit Description</button>
          <button onclick="deletePhoto(${i})">Delete post</button>
          </div>
          `;
        }

        photoList.innerHTML = photoListHTML;
  };


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

});