<!DOCTYPE html>
<html>
<head>
  <title>My Single Page Application</title>
  <link rel="stylesheet" type="text/css" href="styles.css">
  <link rel="stylesheet" type="text/css" href="popup.css">
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Caveat">
</head>
<body>
  <header>
    <img src="img/logo2.png" alt="Logo" class="logo">
    <!-- Добавлено окно для поиска -->
    <div class="search-box">
      <input type="text" placeholder="Поиск">
      <button type="submit">Найти</button>
    </div>
    <!-- Конец окна для поиска -->
    <input type="checkbox" id="check">
    <label for="check" class="show-menu">&#8801</label>
    <nav class="menu">
      <ul>
        <!-- <a href="#"> <img src="logo.png" alt="Logo" class="logo"></a> -->
        <li><a href="#about">About Me</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#admin">Admin</a></li>
        <li><a href="https://www.instagram.com/slavafit2/" target = "_blank"><img src="img/iconInst.png" alt="Instagram" class="icon"></a></li>
        <li><a href="https://www.youtube.com/channel/UCtyX9LdmcDRBqdcpru1K0hQ" target = "_blank"><img src="img/iconYT.png" alt="YouTube" class="icon"></a></li>
        <li><a href="https://www.tiktok.com/@slavafit49" target = "_blank"><img src="img/iconTT.png" alt="Tiktok" class="icon"></a></li>
      </ul>
      <label for="check" class="hide-menu">&#215</label>
    </nav>
  </header>
  
  <main id="content"></main>
  
  <footer class="footer">
    <p1>Grupo Mérida Coders &trade; SlavaFit &copy;        2023</p1><br>
    <div>Любое копирование материалов с сайта без согласия автора - запрещено.</div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
