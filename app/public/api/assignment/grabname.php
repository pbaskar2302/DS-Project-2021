<?php

require 'class/DbConnection.php';

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query
$sql = 'SELECT firstName FROM referee JOIN assignments ON referee.id=assignments.refereeAssignmentId where referee.id= ?';
$vars = [$_GET['selref']];
$stmt = $db->prepare($sql);
$stmt->execute($vars);

$name = $stmt->fetchAll();

// Step 3: Convert to JSON
$json = json_encode($name, JSON_PRETTY_PRINT);
header('Content-Type: application/json');
echo $json;