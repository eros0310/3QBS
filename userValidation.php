<?php
	$username = rtrim($_POST['name']);
	$pwd = rtrim($_POST['pwd']);
	$filename = '/var/www/html/user/'.$username.'.txt';
	if(is_file($filename)){
		$handle = fopen($filename, "r");
		//server side validation
		$pwdCheck = fgets($handle);
		if($pwd != rtrim($pwdCheck)){
			echo 1;
		}
		else{
			echo $filename;
		}
		fclose($handle);
	}
	else{
		echo 0;
	}
?>