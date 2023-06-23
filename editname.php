<?php
$data = file_get_contents('php://input');
$request = json_decode($data);

if ($request && isset($request->photos) && count($request->photos) > 0) {
  $galleryData = json_decode(file_get_contents('gallery.json'));

  foreach ($request->photos as $photo) {
    $index = $photo->index;
    $name = $photo->name;
    
    if ($index >= 0 && $index < count($galleryData->photos)) {
      $galleryData->photos[$index]->name = $name;
    }
  }

  file_put_contents('gallery.json', json_encode($galleryData, JSON_PRETTY_PRINT));
}
?>
