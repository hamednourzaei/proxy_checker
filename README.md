# Proxy Checker Script

This script verifies if proxies are working by sending HTTP requests to a test URL (httpbin.org/ip) using the `axios` library. It provides a progress bar to track the verification of proxies in real-time. The script reads a list of proxies from a file, checks each proxy, and saves the valid ones to a separate file. Any errors encountered during the proxy check process are logged to an error file.

## Features
- Checks proxies by sending HTTP requests to a test URL.
- Displays a progress bar for real-time status tracking.
- Handles concurrent proxy checks with a maximum number of simultaneous threads.
- Logs invalid proxies and errors to a file.
- Saves valid proxies to a specified file.
- Customizable user-agent strings for simulating different browsers.
- Configurable timeout for each request.

## Requirements
- Node.js (v14.x or higher)
- `axios` for HTTP requests
- `cli-progress` for displaying progress bars

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hamednourzaei/proxy-checker.git
   cd proxy-checker
