<?php
$data = file_get_contents('php://input');
$request = json_decode($data);

if ($request && isset($request->photo)) {
  $galleryData = json_decode(file_get_contents('gallery.json'));

  $index = intval($request->photo->id);
  $name = $request->photo->name;

  if ($index >= 0 && $index < count($galleryData->photos)) {
    $galleryData->photos[$index]->name = $name;
    file_put_contents('gallery.json', json_encode($galleryData, JSON_PRETTY_PRINT));
    http_response_code(200); // Отправляем успешный статус ответа
  } else {
    http_response_code(400); // Отправляем ошибку, если индекс фото некорректный
  }
} else {
  http_response_code(400); // Отправляем ошибку, если запрос или данные некорректны
}
?>

