<?php
// This is a simple router script that handles clean URLs
$request_uri = $_SERVER['REQUEST_URI'];

// Remove query string if present
if (false !== $pos = strpos($request_uri, '?')) {
    $request_uri = substr($request_uri, 0, $pos);
}

// Remove trailing slash
$request_uri = rtrim($request_uri, '/');

// Get the path without leading slash
$path = ltrim($request_uri, '/');

// Special handling for skinimalism path
if ($path === 'skinimalism') {
    include __DIR__ . '/skinimalism.html';
    exit;
}

// If the path is empty, serve index.html
if ($path === '') {
    include __DIR__ . '/index.html';
    exit;
}

// Check if there's a corresponding HTML file
if (file_exists(__DIR__ . '/' . $path . '.html')) {
    include __DIR__ . '/' . $path . '.html';
    exit;
}

// If a directory was requested and it has index.html, serve it
if (is_dir(__DIR__ . '/' . $path) && file_exists(__DIR__ . '/' . $path . '/index.html')) {
    include __DIR__ . '/' . $path . '/index.html';
    exit;
}

// Fallback to index.html if nothing is found
include __DIR__ . '/index.html';
?> 