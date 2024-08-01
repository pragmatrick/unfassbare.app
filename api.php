<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Get environment variables
$servername = getenv('DB_SERVER');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$dbname = getenv('DB_NAME');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Retrieve 'get' parameter from query string
$getParam = isset($_GET['get']) ? $_GET['get'] : null;

// Function to get all words
function getAllWords($conn) {
    $sql = "SELECT word FROM words ORDER BY word ASC";
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error]));
    }
    $words = [];
    while($row = $result->fetch_assoc()) {
        $words[] = $row['word'];
    }
    return json_encode($words);
}

// Function to get a specified number of random words
function getRandomWords($conn, $count) {
    $sql = "SELECT word FROM words ORDER BY RAND() LIMIT " . intval($count);
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error]));
    }
    $words = [];
    while($row = $result->fetch_assoc()) {
        $words[] = $row['word'];
    }
    return json_encode($words);
}

// Function to get a random word
function getRandomWord($conn) {
    $sql = "SELECT word FROM words ORDER BY RAND() LIMIT 1";
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die(json_encode(['error' => 'Query failed: ' . $conn->error]));
    }
    $word = $result->fetch_assoc();
    return $word['word'];
}

// Handle the request based on the 'get' parameter
if (isset($_GET['words'])) {
    $getParam = $_GET['words'];
    if ($getParam === '') {
        // ?get without a value, return all words
        echo getAllWords($conn);
    } elseif (ctype_digit($getParam)) {
        // ?get with a numeric value, return that many random words
        $count = intval($getParam);
        echo getRandomWords($conn, $count);
    } 
} 
elseif (isset($_GET['hallo'])) {
    // Determine the greeting based on the time of day
    $now = new DateTime("now", new DateTimeZone("Europe/Berlin"));
    $hour = $now->format('G');

    if ($hour >= 3 && $hour < 12) {
        $timeOfDay = "Morgen";
    } elseif ($hour >= 12 && $hour < 18) {
        $timeOfDay = "Tag";
    } else {
        $timeOfDay = "Abend";
    }

    // Fetch a random word and append "EN"
    $randomWord = getRandomWord($conn) . "EN";

    // Construct the greeting
    $greeting = "Einen " . $randomWord . " guten " . $timeOfDay . "!";

    // Return the greeting as JSON
    echo json_encode($greeting);
}
elseif (isset($_GET['ciao'])) {
    // Fetch a random word and append "EN"
    $randomWord = getRandomWord($conn) . "E";
    $firstLetter = mb_strtoupper(mb_substr($randomWord, 0, 1, 'UTF-8'), 'UTF-8');
    $remainingString = mb_strtolower(mb_substr($randomWord, 1, null, 'UTF-8'), 'UTF-8');
    $randomWord = $firstLetter . $remainingString;

    // Construct the greeting
    $greeting = $randomWord . " Grüße";

    // Return the greeting as JSON
    echo json_encode($greeting);
}
else {
    // If neither 'get' nor 'einen' is set, return nothing
    echo json_encode([]);
}

// Close connection
$conn->close();
?>