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
        <h2>Bienvenido, soy Slava, y me gustaría enseñarte algo...</h2>
        <div class="author-info">
          <img src="img/mi photo.png" alt="Author Photo" class="author-photo">
          
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
        
        let galleryHTML = '<h2>"Extremadura: ¡Descubre nuevas fronteras y aventuras!"</h2>';
        galleryHTML += '<div class="gallery-row">';
        // for (let i = 0; i < galleryData.length; i++) {
        // Изменяем цикл для обратного порядка
        for (let i = galleryData.length - 1; i >= 0; i--) {
          const photo = galleryData[i];
          galleryHTML += `
            <div class="photo">
            <img src="${photo.image}" alt="${photo.name}">
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
    const imageNane = this.querySelector('img').alt;
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
          <img src="${imageSrc}" alt="Popup Image">
          <h3>${imageNane}</h3>
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
        photoListHTML += '<div class="gallery-row">';
        // for (let i = 0; i < galleryData.length; i++) {
        // Изменяем цикл для обратного порядка
        for (let i = galleryData.length - 1; i >= 0; i--) {
          const photo = galleryData[i];
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
