<?php
	$connection = mysqli_connect("localhost", "if14", "ifikas2014", "if14_ian_b");
	
	if(isSet($_REQUEST["name"])){
		$name = $_REQUEST["name"];
		$score = $_REQUEST["score"];
		$sql = "INSERT INTO highscores(name, score)VALUES('".$name."',".$score.");";
		$query=mysqli_query($connection, $sql);
		mysqli_close($connection);
		header("Location: index.php");
	// }elseif(isSet($_REQUEST[])){
		
	
	}else{
		echo "boohoofaker";
	}
?>