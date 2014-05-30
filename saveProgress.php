<?php
	$raw = rtrim($_POST['data']);
	$username = rtrim($_POST['name']);
	$filename = '/var/www/html/user/'.$username.'.txt';
	$handle = fopen($filename, "r");
	$pwd = fgets($handle);
	fclose($handle);
	$content = explode('split', $raw);
	$final = '===='.PHP_EOL;
	for($i = 0 ; ($i < count($content)-1);$i++){
		$final = $final.$content[$i].PHP_EOL;
	}
	$final = $pwd.$final;
	file_put_contents($filename, $final);
	echo $final;
?>