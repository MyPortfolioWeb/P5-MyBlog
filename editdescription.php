<?php
$data = file_get_contents('php://input');
$request = json_decode($data);

if ($request && isset($request->index) && isset($request->description)) {
  $index = $request->index;
  $description = $request->description;
  
  $galleryData = json_decode(file_get_contents('gallery.json'));
  
  if ($index >= 0 && $index < count($galleryData)) {
    $galleryData[$index]->description = $description;
    file_put_contents('gallery.json', json_encode($galleryData));
  }
}
?>


<!-- $data = file_get_contents('php://input');: Эта строка получает данные из тела запроса, отправленного на сервер. php://input - это поток, который позволяет получить данные запроса POST.

$request = json_decode($data);: Здесь данные запроса, полученные в предыдущей строке, декодируются из JSON формата в объект PHP. Функция json_decode используется для этой цели.

if ($request && isset($request->index) && isset($request->description)) {: Это условие проверяет, существует ли объект $request и есть ли у него свойства index и description. Если условие выполняется, значит в запросе присутствуют необходимые данные.

$index = $request->index;: Здесь значение свойства index из объекта $request присваивается переменной $index.

$description = $request->description;: Здесь значение свойства description из объекта $request присваивается переменной $description.

$galleryData = json_decode(file_get_contents('gallery.json'));: Эта строка читает содержимое файла gallery.json и декодирует его в объект PHP. Таким образом, данные из файла gallery.json загружаются в переменную $galleryData.

if ($index >= 0 && $index < count($galleryData)) {: Это условие проверяет, что значение $index находится в диапазоне от 0 до количества элементов в $galleryData. Это гарантирует, что индекс является допустимым для массива.

$galleryData[$index]->description = $description;: Здесь свойству description объекта с индексом $index в $galleryData присваивается новое значение $description. Таким образом, описание элемента в массиве $galleryData обновляется.

file_put_contents('gallery.json', json_encode($galleryData));: В этой строке обновленный массив $galleryData кодируется в формат JSON с помощью функции json_encode и записывается обратно в файл gallery.json. Таким образом, изменения сохраняются в файле.

В целом, этот код принимает запрос с информацией об индексе и описании, обновляет соответствующий элемент в файле gallery.json и сохраняет обновленные данные обратно в файл. -->