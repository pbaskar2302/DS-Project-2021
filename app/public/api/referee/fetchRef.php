<?php

// try {
//   $_POST = json_decode(
//               file_get_contents('php://input'), 
//               true,
//               2,
//               JSON_THROW_ON_ERROR
//           );
// } catch (Exception $e) {
//   header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
//   // print_r($_POST);
//   // echo file_get_contents('php://input');
//   exit;
// }

require ('class/DbConnection.php');

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();
// This is an example of a parameterized query
$sql = 'SELECT game.field, game.gameDate, game.gameTime, assignments.refereeStatus, assignments.refereeAssignmentId, assignments.id FROM game INNER JOIN assignments ON game.id = assignments.gameAssignmentId WHERE assignments.refereeAssignmentId = ? AND game.gameDate >? AND game.gameDate<? ;';
$vars = [ $_GET['refereeAssignmentId'],
          $_GET['startDate'],
          $_GET['endDate'] ];

$stmt = $db->prepare($sql);
$stmt->execute($vars);

$assignDet = $stmt->fetchAll();

if (isset($_GET['format']) && $_GET['format'] == 'csv' ) {
  header('Content-Type: text/csv');
  echo "Field , Referee Status ,\"Game Time\",\"Game Date \"\r\n";

  foreach($assignDet as $u) {
      echo $u['field'] . "," .$u['refereeStatus'].','.$u['gameTime']
        .','.$u['gameDate']."\r\n";
  }

} else {
  $json = json_encode($assignDet, JSON_PRETTY_PRINT);

  // Step 4: Output
  header('Content-Type: application/json');
  echo $json;
}
