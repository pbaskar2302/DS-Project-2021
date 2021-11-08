<?php

require 'class/DbConnection.php';

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query
$sql = 'SELECT game.field, game.gameDate, game.gameTime, count(*) as cnt FROM game INNER JOIN assignments ON game.id = assignments.gameAssignmentId GROUP BY game.id';
$vars = [];

// if (isset($_GET['guid'])) {
//   // This is an example of a parameterized query
//   $sql = 'SELECT * FROM Patient WHERE patientGuid = ?';
//   $vars = [ $_GET['guid'] ];
// }

$stmt = $db->prepare($sql);
$stmt->execute($vars);

$numgame = $stmt->fetchAll();

if (isset($_GET['format']) && $_GET['format'] == 'csv' ) {
    header('Content-Type: text/csv');
    echo "Game Field, Game Time,\"Game Date\",\"Number of Assignments \"\r\n";

    foreach($numgame as $u) {
        echo $u['field'] . "," .$u['gameDate'].','.$u['gameTime']
          .','.$u['cnt']."\r\n";
    }

} else {
    $json = json_encode($numgame, JSON_PRETTY_PRINT);

    // Step 4: Output
    header('Content-Type: application/json');
    echo $json;
}