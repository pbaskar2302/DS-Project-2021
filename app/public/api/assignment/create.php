<?php

try {
    $_POST = json_decode(
                file_get_contents('php://input'), 
                true,
                2,
                JSON_THROW_ON_ERROR
            );
} catch (Exception $e) {
    header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
    // print_r($_POST);
    // echo file_get_contents('php://input');
    exit;
}

require("class/DbConnection.php");

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query
// Note the use of parameterized statements to avoid injection
$stmt = $db->prepare(
  'INSERT INTO assignments (refereeStatus, refereeAssignmentId, 
  gameAssignmentId)
  VALUES (?, ?, ?)'
);

$stmt->execute([
  $_POST['refereeStatus'],
  $_POST['refereeAssignmentId'],
  $_POST['gameAssignmentId']
]);
header('HTTP/1.1 303 See Other');
header('Location: ../assignment/?game=' . $_POST['gameAssignmentId']);