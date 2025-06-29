const header = () =>/*html*/`
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
const nav = () => /*html*/`
     <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="index.html">
        <img src="img/logo.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
        <span style="color: #7B3F00;">Taste Temptations</span>
      </a>
    </div>
  </nav>
`
const headerContainer = document.querySelector('#header');
headerContainer.insertAdjacentHTML("beforebegin", `${header()}${nav()}`)
headerContainer.remove();



