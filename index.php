<?php
    $now = new DateTime();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>typer</title>
    <link href="https://fonts.googleapis.com/css?family=PT+Sans|PT+Serif" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="TYPER.js?v="<?php echo $now->getTimestamp(); ?>></script>
    <script src="Word.js?v="<?php echo $now->getTimestamp(); ?>></script>
    <script src="views.js?v="<?php echo $now->getTimestamp(); ?>></script>
</head>
<body>

<main role="main">

    <div id="typer">
     <!--  <canvas id="nightMode" onclick="nightMode()"></canvas> -->
    </div>
    <div id="scores">
        <!-- Scores page goes here -->
    </div>
    <div id="home">
        <div class="wrapper">
            <div>
                <h1>Welcome to Typ3r!</h1>
                <p>Typ3r is a word typing game</p>
                <br>
                <a href="#typer" class="button">>>Play Typ3r!<<</a><br>
                <a href="#scores" class="button">..::Top Scor3s::..</a>
            </div>
        </div>
    </div>
</main>
</body>
</html>