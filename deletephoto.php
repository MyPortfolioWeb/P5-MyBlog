<?php
$data = file_get_contents('php://input');
$request = json_decode($data);

if ($request && isset($request->index)) {
  $index = $request->index;
  $galleryData = json_decode(file_get_contents('gallery.json'));
  
  if ($index >= 0 && $index < count($galleryData)) {
    array_splice($galleryData, $index, 1);
    file_put_contents('gallery.json', json_encode($galleryData));
  }
}
?>
