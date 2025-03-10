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
   npm install


## Usage
Configuration
Before running the script, you may need to adjust the following configurations:

Proxy List File: Ensure the proxy_list_ips_only.txt file is present in the project directory with proxies in the IP:PORT format.
User Name: Customize the creator’s name in the script by changing the value of the name variable.
Test URLs: You can modify the testUrls array to add or remove test URLs for proxy validation.
Running the Script
Run the script by executing the following command:

    ```bash

     node proxy_checker.js
## Output
The script will display a progress bar indicating the current status of proxy checks.
Valid proxies will be saved to good.txt.
Invalid proxies and errors will be logged in proxy_errors.log.
Example Output


    ```bash
         ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗   ██╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗
        ██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
      ...
    🔍 Checking proxies | ████████████████████░░░░░░░░░░░░░░ | 95% | 100 checked
    ✅ Valid proxy: 192.168.1.1:8080

## Files
proxy_list_ips_only.txt: List of proxies to check.
good.txt: Contains the valid proxies after the check.
proxy_errors.log: Logs invalid proxies with error messages.
Customization
You can easily customize the script by adjusting the following:

Proxy File: Modify the path to the proxy list file if needed.
Timeout: Change the timeoutMs variable to adjust the request timeout duration.
Concurrency: Adjust the maxThreads variable to set the maximum number of concurrent proxy checks.
## License
This project is licensed under a proprietary license. You may not modify, distribute, or use the software without explicit permission from the author. All rights are reserved.

For more details, please contact the author.
