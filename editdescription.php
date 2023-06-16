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
