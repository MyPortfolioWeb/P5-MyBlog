  window.addEventListener('load', function() {
  // Добавляем событие загрузки страницы для установки стартовой страницы
  window.location.hash = '#gallery';
  // Загрузка контента на основе хэша в URL
  function loadContent() {
    const hash = window.location.hash.slice(1);
    const content = document.getElementById('content');
    
    if (hash === 'about') {
      // content.innerHTML = '<h1>About Me</h1><p>This is the About Me page content.</p>';
      content.innerHTML = `
      <section class="about-section">
      <h2>About Me</h2>
      <div class="author-info">
        <img src="img/My sons and me.jpg" alt="Author Photo" class="author-photo">
        <div class="author-details">
          <h3>Viacheslav Fitlin</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lobortis, ligula ut venenatis ultrices, quam eros vulputate risus, a feugiat nibh dui a enim. Curabitur pulvinar varius tortor, non lacinia nibh consequat sit amet. Nulla venenatis faucibus dolor, et vestibulum nisi facilisis sed. Nullam vitae gravida turpis. In eu tristique nibh. Phasellus efficitur pellentesque purus, sit amet suscipit sem rhoncus at.
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
    xhr.onload = function() {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const content = document.getElementById('content');
        let galleryHTML = '<h1>Gallery</h1>';
        // for (let i = 0; i < galleryData.length; i++) {
        // Изменяем цикл для обратного порядка
            for (let i = galleryData.length - 1; i >= 0; i--) {
          const photo = galleryData[i];
          galleryHTML += `<div class="photo"><img src="${photo.image}" alt="${photo.description}"><p>${photo.description}</p></div>`;
        }
        
        content.innerHTML = galleryHTML;
      }
    };
    xhr.send();
  }
  
  // Загрузка страницы Admin
  function loadAdmin() {
    const content = document.getElementById('content');
    content.innerHTML = `
      <h1>Admin</h1>
      <form id="addPhotoForm">
        <input type="file" name="image" accept="image/*" required>
        <input type="text" name="description" placeholder="Description" required>
        <button type="submit">Add Photo</button>
      </form>
      <div id="photoList"></div>
    `;
    
    const addPhotoForm = document.getElementById('addPhotoForm');
    addPhotoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const imageInput = addPhotoForm.elements.image;
      const descriptionInput = addPhotoForm.elements.description;
      
      const file = imageInput.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageBase64 = e.target.result;
          
          const newPhoto = {
            image: imageBase64,
            description: descriptionInput.value
          };
          
          savePhoto(newPhoto);
          imageInput.value = '';
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
    xhr.onload = function() {
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
    xhr.onload = function() {
      if (xhr.status === 200) {
        const galleryData = JSON.parse(xhr.responseText);
        const photoList = document.getElementById('photoList');
        
        let photoListHTML = '<h2>Photo List</h2>';
        for (let i = 0; i < galleryData.length; i++) {
          const photo = galleryData[i];
          photoListHTML += `
          <div class="photo">
          <img src="${photo.image}" alt="${photo.description}">
          <p>${photo.description}</p>
          <button onclick="editDescription(${i})">Edit</button>
          <button onclick="deletePhoto(${i})">Delete</button>
          </div>
          `;
        }
        
        photoList.innerHTML = photoListHTML;
      }
    };
    xhr.send();
  }
  
// Редактирование описания фото
window.editDescription = function(index) {
  const description = prompt("Enter the new description:");
  if (description !== null) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'editdescription.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        loadPhotoList();
      }
    };
    xhr.send(JSON.stringify({ index: index, description: description }));
  }
}
  
// Удаление фото на странице Admin
window.deletePhoto = function(index) {
  const confirmDelete = confirm("Are you sure you want to delete this photo?");
  if (!confirmDelete) {
    return;
  }
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'deletephoto.php', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
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
    loginForm.addEventListener('submit', function(event) {
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
  
  // // Выход из системы
  // function logout() {
  //   localStorage.setItem('loggedIn', 'false');
  //   window.location.hash = '';
  // }
  
  // Обработка изменений хэша в URL
  window.addEventListener('hashchange', loadContent);
  
  // Инициализация загрузки контента
  loadContent();
});

// Открытие всплывающего окна с увеличенным фото
window.openPopup = function(imageSrc, description) {
  const popup = document.createElement('div');
  popup.classList.add('popup');

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const image = document.createElement('img');
  image.src = imageSrc;

  const caption = document.createElement('p');
  caption.textContent = description;

  popupContent.appendChild(image);
  popupContent.appendChild(caption);
  popup.appendChild(popupContent);

  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });

  document.body.appendChild(popup);

  // Блокируем скроллинг фона при открытом всплывающем окне
  document.body.style.overflow = 'hidden';
}

// Закрытие всплывающего окна
window.closePopup = function() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.parentNode.removeChild(popup);
  }

  // Разблокируем скроллинг фона
  document.body.style.overflow = 'auto';
}

// Обработка события изменения хэша в URL
window.addEventListener('hashchange', function() {
  const hash = window.location.hash.substr(1);
  
  switch (hash) {
    case 'gallery':
      loadGalleryPage();
      break;
    // Добавьте обработку других страниц, если необходимо
  }
});

// Загрузка страницы с галереей
function loadGalleryPage() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'gallery.json', true);
  xhr.onload = function() {
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
