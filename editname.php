<?php
$data = file_get_contents('php://input');
$request = json_decode($data);

if ($request && isset($request->index) && isset($request->name)) {
  $index = $request->index;
  $name = $request->name;
  
  $galleryData = json_decode(file_get_contents('gallery.json'));
  
  if ($index >= 0 && $index < count($galleryData)) {
    $galleryData[$index]->name = $name;
    file_put_contents('gallery.json', json_encode($galleryData));
  }
}
?>
