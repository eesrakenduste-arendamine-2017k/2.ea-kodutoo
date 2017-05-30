<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Mäng</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script type="text/javascript">
	$.ajax({
		type: "POST",
		url: "gethighscore.php",
		cache: true,
		success: function(html){
			$('#score').html(html);
		}  
	});
	
	</script>
</head>
<body>
	<div id="startup">
		<div id="score">
		<table id="scoretable"></table>
		</div>
		<div id="startbtn" class="noselect" onClick="window.open('index2.php', '_self');">Alusta mängu</div>
	</div>
</body>
</html>