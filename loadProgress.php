<?php
	$username = rtrim($_POST['name']);
	$filename = '/var/www/html/user/'.$username.'.txt';
	$raw = file_get_contents($filename);
	$content = explode('===='.PHP_EOL, $raw);
	echo rtrim($content[1]);
?>