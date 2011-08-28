<?php

$filename = dirname(__FILE__).'/data.txt';

$lastmodif = isset($_GET['timestamp']) ? $_GET['timestamp'] : 0;
$currentmodif = filemtime($filename);

if ($currentmodif <= $lastmodif) {
/* 	usleep(10000); */
/* 	clearstatcache(); */
/* 	$currentmodif = filemtime($filename); */
} else {
	$response = array();
	$response['msg'] = file_get_contents($filename);
	$response['err'] = "err";
	$response['timestamp'] = $currentmodif;
	echo json_encode($response);
}

?>