<?php
	$connection = mysqli_connect("localhost", "if14", "ifikas2014", "if14_ian_b");

		$sql = "SELECT @row_number:=@row_number+1 AS row_number, name, score FROM highscores, (SELECT @row_number:=0) AS t ORDER BY score DESC LIMIT 10";
		
		
		
		$query=mysqli_query($connection, $sql);
		echo "<table style='width:300px; height:300px;'>
				<tr style='height:7px; width:300px;'>
					<th style='height:7px; width:150px;'>Koha number</th>
					<th style='height:7px; width:150px;'>Nimi</th>
					<th style='height:7px; width:150px;'>Skoor</th>
				</tr>
		
		";
		while($row=mysqli_fetch_array($query)){
			?>
				<tr style="height:7px; width:300px;">
				<td style="height:7px; width:150px; text-align:center;"><?php echo $row['row_number']; ?></td>
				<td style="height:7px; width:150px; text-align:center;"><?php echo $row['name']; ?></td>
				<td style="height:7px; width:150px; text-align:center;"><?php echo $row['score']; ?></td>
				</tr>
			<?php
		}
		echo "</table>";
		mysqli_close($connection);

?>