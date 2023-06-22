<?php
$data = file_get_contents('php://input');
  // Эта строка кода считывает данные, переданные с помощью HTTP-запроса, используя специальный поток php:input. 
  // Обычно это данные, отправленные с помощью метода POST или PUT. В данном случае, данные ожидаются в формате JSON.
$photo = json_decode($data);
  // Здесь данные, считанные на предыдущем шаге, декодируются из формата JSON в объект или ассоциативный массив, 
  // в зависимости от настроек функции json_decode(). Предполагается, что переданные данные представляют собой объект или 
  // массив с информацией о фото.
if ($photo) {
  // Данный блок if проверяет, был ли успешно декодирован объект или массив $photo из переданных данных. 
  // Если переменная $photo не равна null, значит декодирование прошло успешно, и код внутри блока if будет выполнен.
  $galleryData = json_decode(file_get_contents('gallery.json'));
  // Здесь содержимое файла gallery.json считывается и декодируется в переменную $galleryData. 
  // Предполагается, что gallery.json уже содержит JSON-данные, представляющие массив объектов или массив фотографий.
  $galleryData[] = $photo;
  // В этой строке новое фото, представленное объектом или массивом $photo, добавляется в конец массива $galleryData. 
  // Теперь массив $galleryData содержит все предыдущие фото из gallery.json плюс новое фото.
  file_put_contents('gallery.json', json_encode($galleryData));
}
?>


<!-- $data = file_get_contents('php://input');

Эта строка кода считывает данные, переданные с помощью HTTP-запроса, используя специальный поток php://input. Обычно это данные, отправленные с помощью метода POST или PUT. В данном случае, данные ожидаются в формате JSON.

$photo = json_decode($data);

Здесь данные, считанные на предыдущем шаге, декодируются из формата JSON в объект или ассоциативный массив, в зависимости от настроек функции json_decode(). Предполагается, что переданные данные представляют собой объект или массив с информацией о фото.

if ($photo) { ... }

Данный блок if проверяет, был ли успешно декодирован объект или массив $photo из переданных данных. Если переменная $photo не равна null, значит декодирование прошло успешно, и код внутри блока if будет выполнен.

$galleryData = json_decode(file_get_contents('gallery.json'));

Здесь содержимое файла gallery.json считывается и декодируется в переменную $galleryData. Предполагается, что gallery.json уже содержит JSON-данные, представляющие массив объектов или массив фотографий.

$galleryData[] = $photo;

В этой строке новое фото, представленное объектом или массивом $photo, добавляется в конец массива $galleryData. Теперь массив $galleryData содержит все предыдущие фото из gallery.json плюс новое фото.

file_put_contents('gallery.json', json_encode($galleryData));

В этой строке массив $galleryData кодируется обратно в формат JSON с помощью функции json_encode() и записывается обратно в файл gallery.json, перезаписывая его. Теперь файл gallery.json содержит обновленные данные, включая новое добавленное фото.

Таким образом, этот фрагмент кода предназначен для обработки данных о фото, полученных от клиента, добавления нового фото в существующий список фото в файле gallery.json и обновления этого файла. -->
