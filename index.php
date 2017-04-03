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
        <canvas id="nightMode"></canvas>
        <div class="newGame" >
            <a id="startNewGame" href="#typer" class="button" onclick="startNewGame()" >>>Start Typ3r!<<</a>
            <a id="NightMode" href="#typer" class="button" onclick="nightMode()">>>Night Mod3!<<</a>
            <p id="timer"></p>
        </div>
    </div>
    <div id="scores">
        <div class="wrapper">
            <div>
                <h1>Top Scor3s!</h1>
                <p id="player"></p>
                <br>
                <a href="#typer" class="button">>>Play Typ3r!<<</a><br>
                <a href="#home" class="button">..::Typ3r Hom3::..</a>
            </div>
        </div>
    </div>
    <div id="home">
        <div class="wrapper">
            <div>
                <h1>Welcome to Typ3r!</h1>
                <p>Typ3r is a word typing game</p>
                <br>
                <a href="#typer" class="button">>>Play Typ3r!<<</a><br>
                <a href="#scores" onclick="playerName()" class="button">..::Top Scor3s::..</a>
            </div>
        </div>
    </div>
</main>
</body>
</html>