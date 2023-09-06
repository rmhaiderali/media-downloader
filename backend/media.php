<?php
// Get all request headers
$requestHeaders = getallheaders();

// Determine the request method (GET, POST, PUT, DELETE, etc.)
$requestMethod = $_SERVER["REQUEST_METHOD"];

// Construct the URL for the main server
$requestUrl = "http://159.223.36.123:3001/media" . str_replace($_SERVER["SCRIPT_NAME"], "", $_SERVER["REQUEST_URI"]);

// Create a cURL handle
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $requestUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod);

// Set custom headers from the client's request
$clientHeaders = [];
foreach ($requestHeaders as $header => $value) {
    $clientHeaders[] = "$header: $value";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $clientHeaders);

// If it's a POST or PUT request, set the request data
if ($requestMethod === "POST" || $requestMethod === "PUT") {
    $postData = file_get_contents("php://input");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
}

// Execute cURL and retrieve the response along with additional information
$response = curl_exec($ch);
$responseStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$responseContentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$responseHeaderSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

// Check if the main server refused to connect
if ($responseStatusCode === 0) {
    http_response_code(500);
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    echo json_encode(["error" => "Main server refused to connect."]);
    exit;
}

// Extract response headers from the cURL response
$responseHeaders = substr($response, 0, $responseHeaderSize);

// Close the cURL handle
curl_close($ch);

// Set the status code received from the main server
http_response_code($responseStatusCode);

// Split the response headers into an array and exclude unwanted headers
$excludeHeaders = ["Content-Security-Policy: default-src 'none'"];
$responseHeaders = array_diff(explode("\r\n", $responseHeaders), $excludeHeaders);

// Forward the received headers from the main server back to the client
foreach ($responseHeaders as $header) {
    if (!empty($header)) {
        header($header);
    }
}

// Output the response body (excluding headers)
echo substr($response, $responseHeaderSize);
