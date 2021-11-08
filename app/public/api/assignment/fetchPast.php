<?php

require 'class/DbConnection.php';

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query
$sql = 'SELECT * 
FROM game
WHERE gameDate<= CURDATE()';
$vars = [];

if (isset($_GET['referee'])) {
    // This is an example of a parameterized query
    $sql = 'SELECT game.field, game.gameDate, game.gameTime, assignments.refereeStatus, assignments.refereeAssignmentId, assignments.id FROM game INNER JOIN assignments 
    ON game.id = assignments.gameAssignmentId 
    WHERE game.gameDate < CURDATE() and assignments.refereeAssignmentId = ? ;';
    $vars = [ $_GET['referee'] ];
  }

$stmt = $db->prepare($sql);
$stmt->execute($vars);

$pastGame = $stmt->fetchAll();

// Step 3: Convert to JSON
$json = json_encode($pastGame, JSON_PRETTY_PRINT);

// Step 4: Output
header('Content-Type: application/json');
echo $json;