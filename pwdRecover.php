<?php
	$address = rtrim($_POST['add']);
	$full_address = '/var/www/html/user/'.$address.'.txt';
	//server side validation
	if(is_file($full_address)){
		$handle = fopen($full_address, "r");
		$pwdCheck = "ÄãµÄÃÜ´aÊÇ£º".rtrim(fgets($handle));
		fclose($handle);

		mail($address, 'ÃÜ´aŒ¤»Ø', $pwdCheck);
		
		echo 1;
	}
	else{
		echo 0;
	}
?>