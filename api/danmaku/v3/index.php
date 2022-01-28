<?php
include 'config.php';
include 'db.php';
$id = '';
$code = 0;
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $data = json_decode(file_get_contents('php://input'));
    if (isset($data->id)) {
        $id = $data->id;
    }
    if (isset($data->id) && isset($data->author) && isset($data->color) && isset($data->text) && isset($data->time) && isset($data->token) && isset($data->type) && strlen($data->text) <= 100){
        add_danmaku($data->author, $data->color, $data->id, $data->text, $data->time, $data->token, $data->type);
    } else {
        $code = -1;
    }
}

$result = search_danmaku($id);
$list = array();
for ($i = 0; $i < count($result); $i++) {
    $list[$i] = array($result[$i]['time'], $result[$i]['type'], $result[$i]['color'], $result[$i]['author'], $result[$i]['text']);
}
$data = array('code' => $code, 'data' => $list);
$json = json_encode($data);
exit($json);
