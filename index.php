<!DOCTYPE html>
<html>
<head>
  <title>Blog by SlavaFit</title>
  <link rel="stylesheet" type="text/css" href="styles.css">
  <link rel="icon" href="img/logo2.png" type="image/x-icon">
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Caveat">
</head>
<body>
  <header>
    <div class="header-container">
      <img src="img/logo2.png" alt="Logo" class="logo">
    </div>
    <div class="search-box">
      <input type="text" placeholder="Escribe aquí">
      <button type="submit">Buscar</button>
    </div>
    <!-- Конец окна для поиска -->
    <input type="checkbox" id="check">
    <label for="check" class="show-menu">&#8801</label>
    <nav class="menu">
      <ul>
        <li><a href="#about">Sobre mí</a></li>
        <li><a href="#gallery">Galería</a></li>
        <li><a href="#admin">Admin</a></li>
        <li><a href="https://www.instagram.com/slavafit2/" target = "_blank"><img src="img/iconInst.png" alt="Instagram" class="icon"></a></li>
        <li><a href="https://www.youtube.com/channel/UCtyX9LdmcDRBqdcpru1K0hQ" target = "_blank"><img src="img/iconYT.png" alt="YouTube" class="icon"></a></li>
        <li><a href="https://www.tiktok.com/@slavafit49" target = "_blank"><img src="img/iconTT.png" alt="Tiktok" class="icon"></a></li>
      </ul>
      <label for="check" class="hide-menu">&#215</label>
    </nav>
  </header>

  <div id="progress_line"></div>
  
  <main id="content"></main>

  <div class="btn-up btn-up_hide"></div>
  
  <footer class="footer">
    <p1>Grupo Mérida Coders &trade; SlavaFit &copy; 2023</p1><br>
    <div>Queda prohibida la copia de material de este sitio sin el consentimiento del autor.</div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
