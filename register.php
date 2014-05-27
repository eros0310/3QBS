<?php
	$username = rtrim($_POST['name']);
	$pwd = rtrim($_POST['pwd']);
	$filename = '/var/www/html/user/'.$username.'.txt';
	if(is_file($filename)){
		echo 0;
	}
	else{
		$handle = fopen($filename, "w");
		file_put_contents($filename, $pwd.PHP_EOL);
		fclose($handle);
		echo $filename;
	}
?>