<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Get environment variables
$servername = getenv('DB_SERVER');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$dbname = getenv('DB_NAME');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error], JSON_UNESCAPED_UNICODE));
}

// Function to get all words
function getAllWords($conn, $count = null) {
    $sql = "SELECT word FROM words ORDER BY word ASC";
    if ($count !== null) $sql .= " LIMIT " . intval($count);
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error], JSON_UNESCAPED_UNICODE));
    }
    $words = [];
    while($row = $result->fetch_assoc()) {
        $words[] = $row['word'];
    }
    return json_encode($words, JSON_UNESCAPED_UNICODE);
}

// Function to get a specified number of random words
function getRandomWords($conn, $count = null) {
    $sql = "SELECT word FROM words ORDER BY RAND()";
    if ($count !== null) $sql .= " LIMIT " . intval($count);
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error], JSON_UNESCAPED_UNICODE));
    }
    $words = [];
    while($row = $result->fetch_assoc()) {
        $words[] = $row['word'];
    }
    return json_encode($words, JSON_UNESCAPED_UNICODE);
}

// Function to get a random word
function getRandomWord($conn) {
    $sql = "SELECT word FROM words ORDER BY RAND() LIMIT 1";
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error], JSON_UNESCAPED_UNICODE));
    }
    $word = $result->fetch_assoc();
    return $word['word'];
}

// /api/words/ always returns an array.
if (($apiEndpoint ?? '') === 'words') {
    $random = filter_var($_GET['random'] ?? 'false', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    $count = isset($_GET['limit'])
        ? filter_var($_GET['limit'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
        : null;
    if ($random === null || $count === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid random or limit parameter.']);
    } else {
        echo $random ? getRandomWords($conn, $count) : getAllWords($conn, $count);
    }
}
// /api/greetings/?type=hey
elseif (($apiEndpoint ?? '') === 'greetings' && $type === 'hey') {
    // Determine the greeting based on the time of day
    $now = new DateTime("now", new DateTimeZone("Europe/Berlin"));
    $hour = $now->format('G');

    if ($hour >= 3 && $hour < 12) {
        $timeOfDay = "Morgen";
    } else if ($hour >= 12 && $hour < 18) {
        $timeOfDay = "Tag";
    } else {
        $timeOfDay = "Abend";
    }

    // Fetch a random word and append "EN"
    $randomWord = getRandomWord($conn) . "EN";

    // Construct the greeting
    $greeting = "Einen " . $randomWord . " guten " . $timeOfDay . "!";

    // Return the greeting as JSON
    echo json_encode($greeting, JSON_UNESCAPED_UNICODE);
} 
// /api/greetings/?type=bye
elseif (($apiEndpoint ?? '') === 'greetings' && $type === 'bye') {
    // Fetch a random word and append "EN"
    $randomWord = getRandomWord($conn) . "E";
    $firstLetter = mb_strtoupper(mb_substr($randomWord, 0, 1, 'UTF-8'), 'UTF-8');
    $remainingString = mb_strtolower(mb_substr($randomWord, 1, null, 'UTF-8'), 'UTF-8');
    $randomWord = $firstLetter . $remainingString;

    // Construct the greeting
    $greeting = $randomWord . " Grüße";

    // Return the greeting as JSON
    echo json_encode($greeting, JSON_UNESCAPED_UNICODE);
} 
// invalid
else {
    echo json_encode([], JSON_UNESCAPED_UNICODE);
}

// Close connection
$conn->close();