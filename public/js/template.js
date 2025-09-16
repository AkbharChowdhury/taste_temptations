const header = /*html*/`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
   <title>Taste Temptations: find your next cravings</title>
    <link rel="stylesheet" href="css/style.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
</head>
<body>   
`;
const nav = /*html*/`
     <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href=".">
        <img src="img/logo.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top" id="logo_text">
        <span id="logo_text">Taste Temptations</span>
      </a>
    </div>
  </nav>
`;
const footer =  /*html*/`
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q"
    crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.5/dist/htmx.min.js"
    integrity="sha384-t4DxZSyQK+0Uv4jzy5B0QyHyWQD2GFURUmxKMBVww9+e2EJ0ei/vCvv7+79z0fkr"
    crossorigin="anonymous"></script>


  
`;
const headerContainer = document.querySelector('#header');
headerContainer.insertAdjacentHTML("beforebegin", `${header}${nav}`)
headerContainer.remove();

const footerContainer = document.querySelector('#footer');
footerContainer.insertAdjacentHTML("beforebegin", footer)
footerContainer.remove();


