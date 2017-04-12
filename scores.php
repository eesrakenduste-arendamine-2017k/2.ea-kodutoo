<?php
    $now = new DateTime();
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>typer</title>
			<link rel="stylesheet" href="css/style.css">
			<script src="js/TYPER.js?v="<?php echo $now->getTimestamp(); ?>></script>
	    <script src="js/Word.js?v="<?php echo $now->getTimestamp(); ?>></script>
	    <script src="js/views.js?v="<?php echo $now->getTimestamp(); ?>></script>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
		html, body, canvas {
			background-color: #E74C3C;
			width: 100%;
			height: 100%;
      font-family: lato, sans-serif;
      overflow: hidden;
		}
		canvas {
			position: absolute;
		}

		.button2 {
		    background-color: #E30E82;
		    border: none;
		    color: white;
		    padding: 15px 32px;
		    text-align: center;
		    text-decoration: none;
		    display: inline-block;
		    font-size: 16px;
		    margin: 4px 2px;
		    cursor: pointer;
		}

		div {
    height: 200px;
    width: 400px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -200px;
}
	</style>


</head>
<body>

	<main role="main">
	    <div id="scores">
	        <div class="wrapper">
	            <div>
								<p id="player"></p>
	                <a onclick="playerName()" class="button2">Top Scores</a>
									<a href="typer.html" class="button2">Play</a>
									<a href="index.html" class="button2">Go Back</a>
	            </div>
	        </div>
	    </div>
	</main>

			<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>

				<script src="js/index.js"></script>


</body>
</html>
