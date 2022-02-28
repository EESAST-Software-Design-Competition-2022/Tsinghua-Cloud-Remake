<?php
$db_host = DB_HOST;
$db_user = DB_USER;
$db_pass = DB_PASS;
$db_name = DB_NAME;
$pdo_s = 'mysql:host=' . $db_host . ';' . 'dbname=' . $db_name;
$pdo = new PDO($pdo_s, $db_user, $db_pass);
function add_danmaku($author, $color, $vid, $text, $time, $token, $type)
{
    global $pdo;
    $sql = "INSERT INTO `TCR_danmaku` (`author`,`color`,`vid`,`text`,`time`,`token`,`type`) VALUES ('" . $author . "','" . $color . "','" . $vid . "','" . $text . "','" . $time . "','" . $token . "','" . $type . "')";
    $pdo->exec($sql);
}
function search_danmaku($vid)
{
    global $pdo;
    $sqlco = "SELECT * FROM `TCR_danmaku` WHERE `vid` = '" . $vid . "'";
    $result = $pdo->query($sqlco);
    $result = $result->fetchAll();
    return $result;
}
