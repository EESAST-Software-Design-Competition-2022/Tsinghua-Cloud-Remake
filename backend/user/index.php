<?php

/**
 *    Copyright (c) 2022 Futrime & M1saka10010
 *    清华大学云盘 Remake is licensed under Mulan PSL v2.
 *    You can use this software according to the terms and conditions of the Mulan PSL v2. 
 *    You may obtain a copy of Mulan PSL v2 at:
 *                http://license.coscl.org.cn/MulanPSL2 
 *    THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.  
 *    See the Mulan PSL v2 for more details.  
 */

require "../config.php";

function addDanmaku($vid, $data)
{
    global $pdo;
    $sql = "INSERT INTO `tcr_danmaku` (`vid`, `author`, `color`,`text`,`time`,`type`,`metadata`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $pdo->prepare($sql)->execute(array($vid, $data->author, $data->color, $data->text, $data->time, $data->type, $data->metadata));
}

function getUser($username)
{
    global $pdo;
    $sql = "SELECT * FROM `tcr_user` WHERE `username`=? ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($username));
    $list = $stmt->fetch();
    if ($list == false) {
        return false;
    }
    return array('username' => $list['username'], 'name' => $list['name'], 'email' => $list['email'], 'following' => $list['following'], 'collection' => $list['collection'], 'avatar_url' => $list['avatar_url'], 'metadata' => $list['metadata']);
}


$pdo = new PDO('mysql:host=' . DB_HOST . ';' . 'dbname=' . DB_NAME, DB_USER, DB_PASS);

if ($_SERVER['REQUEST_METHOD'] == 'GET') { // get all danmakus
    $username = $_GET['username'];
    $result = getUser($username);
    $json = json_encode($result);
    header('Content-Type: application/json');
    echo ($json);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') { // add a danmaku
    $vid = $_GET['vid'];
    $data = json_decode(file_get_contents('php://input'));
    addDanmaku($vid, $data);
}
