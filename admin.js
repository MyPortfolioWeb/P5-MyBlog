window.onload = function() {
    document.getElementById('photoForm').addEventListener('submit', function(e) {
      e.preventDefault();
  
      var fileInput = document.getElementById('photoInput');
      var descriptionInput = document.getElementById('descriptionInput');
  
      var file = fileInput.files[0];
      var description = descriptionInput.value;
  
      var reader = new FileReader();
      reader.onload = function(event) {
        var base64Image = event.target.result;
  
        var photoData = {
          url: base64Image,
          description: description
        };
  
        var photos = JSON.parse(localStorage.getItem('photos')) || [];
        photos.push(photoData);
  
        localStorage.setItem('photos', JSON.stringify(photos));
  
        alert('Фото успешно загружено!');
        fileInput.value = '';
        descriptionInput.value = '';
  
        loadPhotos(); // Обновляем страницу фото после загрузки
      };
      reader.readAsDataURL(file);
    });
  
    loadPhotos();
  };
  
  function deletePhoto(index) {
    var photos = JSON.parse(localStorage.getItem('photos')) || [];
  
    if (index >= 0 && index < photos.length) {
      photos.splice(index, 1);
      localStorage.setItem('photos', JSON.stringify(photos));
      loadPhotos(); // Обновляем страницу фото после удаления
      alert('Фото успешно удалено!');
    }
  }
  
  function addDeleteButton(photoContainer, index) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', function() {
      deletePhoto(index);
    });
    photoContainer.appendChild(deleteButton);
  }
  
  function loadPhotos() {
    var photos = JSON.parse(localStorage.getItem('photos')) || [];
    var photoContainer = document.getElementById('photoContainer');
    photoContainer.innerHTML = '';
  
    photos.forEach(function(photo, index) {
      var img = document.createElement('img');
      img.src = photo.url;
      photoContainer.appendChild(img);
  
      var description = document.createElement('p');
      description.textContent = photo.description;
      photoContainer.appendChild(description);
  
      addDeleteButton(photoContainer, index); // Добавляем кнопку удаления
    });
  }
  