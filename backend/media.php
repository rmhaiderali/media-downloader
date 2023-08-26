<?php
// Get all request headers
$requestHeaders = getallheaders();

// Get the raw query string
$queryString = $_SERVER["QUERY_STRING"];

// Parse the query string into an array of parameters
parse_str($queryString, $queryParams);

// Determine the request method (GET, POST, PUT, DELETE, etc.)
$requestMethod = $_SERVER["REQUEST_METHOD"];

// Construct the proxy URL
$proxyUrl = "http://159.223.36.123:3001" . $_SERVER["REQUEST_URI"];

// Create a cURL handle
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $proxyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod); // Set the request method

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

// Execute cURL and get the response along with additional information
$response = curl_exec($ch);
$httpResponseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Get HTTP response code
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE); // Get content type
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE); // Get header size

// Extract the response headers from the cURL response
$responseHeaders = substr($response, 0, $headerSize);

// Close the cURL handle
curl_close($ch);

// Set the HTTP response code returned from the proxy request
http_response_code($httpResponseCode);

// Forward the received headers from the proxy back to the client
$proxyResponseHeaders = array_diff(explode("\r\n", $responseHeaders), ["Content-Security-Policy: default-src 'none'"]);
foreach ($proxyResponseHeaders as $header) {
    if (!empty($header)) {
        header($header);
    }
}

// Output the response (excluding headers)
echo substr($response, $headerSize);
