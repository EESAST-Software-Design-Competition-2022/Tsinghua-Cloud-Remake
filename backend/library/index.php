<?php

/**
 *    Copyright (c) 2022 Futrime
 *    清华大学云盘 Remake is licensed under Mulan PSL v2.
 *    You can use this software according to the terms and conditions of the Mulan PSL v2. 
 *    You may obtain a copy of Mulan PSL v2 at:
 *                http://license.coscl.org.cn/MulanPSL2 
 *    THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.  
 *    See the Mulan PSL v2 for more details.  
 */

require "../config.php";

function shareFile($data)
{
    global $pdo;
    if (!isset($data->poster)) {
        $data->poster = '';
    }
    $sql = "INSERT INTO `tcr_library` (`fid`, `pid`, `publisher`, `time`, `type`, `tag`, `brief`, `poster`, `metadata`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $pdo->prepare($sql)->execute(array($data->fid, $data->pid, $data->publisher, time(), $data->type, json_encode($data->tag), $data->brief, $data->poster, json_encode($data->metadata)));
    print_r(array($data->fid, $data->pid, $data->publisher, time(), $data->type, json_encode($data->tag), $data->brief, $data->poster, json_encode($data->metadata)));
}

function getFileInfo($query)
{
    global $pdo;
    $sql = "SELECT * FROM `tcr_library` WHERE `type`=? ";
    $query_array = array($query->type);
    if (isset($query->fid)) {
        $sql .= " AND `fid`=? ";
        $query_array[] = $query->fid;
    }
    if (isset($query->pid)) {
        $sql .= " AND `pid`=? ";
        $query_array[] = $query->pid;
    }
    if (isset($query->publisher)) {
        $sql .= " AND `publisher`=? ";
        $query_array[] = $query->publisher;
    }
    if (isset($query->tag)) {
        for ($i = 0; $i < count($query->tag); $i++) {
            $sql .= " AND `tag` LIKE ? ";
            $query_array[] = '%"' . $query->tag[$i] . '"%';
        }
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute($query_array);
    $list = $stmt->fetchAll();
    if ($list == false) {
        return false;
    }
    $result = array();
    for ($i = 0; $i < count($list); $i++) {
        $result[] = array(
            'fid' => $list[$i]['fid'],
            'pid' => $list[$i]['pid'],
            'publisher' => $list[$i]['publisher'],
            'time' => $list[$i]['time'],
            'type' => $list[$i]['type'],
            'tag' => json_decode($list[$i]['tag']),
            'brief' => $list[$i]['brief'],
            'visit_count' => (int)$list[$i]['visit_count'],
            'download_count' => (int)$list[$i]['download_count'],
            'like_count' => (int)$list[$i]['like_count'],
            'collect_count' => (int)$list[$i]['collect_count'],
            'poster' => $list[$i]['poster'],
            'metadata' => json_decode($list[$i]['metadata'])
        );
    }
    return $result;
}


$pdo = new PDO('mysql:host=' . DB_HOST . ';' . 'dbname=' . DB_NAME, DB_USER, DB_PASS);


$data = json_decode(file_get_contents('php://input'));
if ($data->action == 'getFileInfo') {
    $results = getFileInfo($data);
    $json = json_encode($results);
    header('Content-Type: application/json');
    echo ($json);
} else if ($data->action == 'shareFile') {
    shareFile($data);
}
