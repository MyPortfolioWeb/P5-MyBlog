<?php
$data = file_get_contents('php://input');
$photo = json_decode($data);

if ($photo) {
  $galleryData = json_decode(file_get_contents('gallery.json'));
  $galleryData[] = $photo;
  
  file_put_contents('gallery.json', json_encode($galleryData));
}
?>
