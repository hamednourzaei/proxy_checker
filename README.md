Proxy Validator Script
Overview
This script is a tool for validating proxy servers by checking their functionality against a test URL (httpbin.org/ip). It uses axios for sending HTTP requests and cli-progress to display a progress bar in the terminal. The script is designed to efficiently verify a large number of proxies, log errors, and save working proxies to a file.

Features
Proxy Checking: Validates proxy functionality by sending HTTP requests to the specified test URLs.
Error Logging: Logs failed proxy checks into an error log file for further analysis.
Progress Tracking: Displays a real-time progress bar showing the status of proxy verification.
Concurrent Checks: Performs multiple proxy checks concurrently (with a limit on the number of simultaneous requests).
User-Agent Simulation: Simulates requests from different browsers to reduce the chance of detection.
Customizable: Easily customize creator name, file paths, and other settings.
Requirements
Node.js (v12 or higher)
NPM Packages:
axios: For making HTTP requests.
cli-progress: For displaying the progress bar.
fs: For file reading and writing.
Installation
Clone the repository or download the script.
Run npm install to install dependencies:
bash
Copy
Edit
npm install axios cli-progress
Configuration
proxy_list_ips_only.txt: A text file containing the list of proxies in the format IP:PORT.
good.txt: The file where valid proxies are saved.
proxy_errors.log: Logs invalid proxies and errors.
Customize the following in the script:
name: Your name or any preferred text to be displayed in the banner.
proxyFile: Path to the file containing the list of proxies.
goodProxiesFile: Path where valid proxies will be saved.
errorLogFile: Path for logging proxy errors.
testUrls: A list of URLs to test proxies.
timeoutMs: Timeout duration for each proxy check (default: 2 minutes).
maxThreads: Maximum number of concurrent proxy checks.
userAgents: Array of User-Agent strings to simulate different browsers.
proxyPattern: Regular expression for validating proxy format (IP:PORT).
Usage
Prepare the proxy list: Create a file named proxy_list_ips_only.txt and add your proxies in the format IP:PORT.

Run the script: In the terminal, execute the script:

bash
Copy
Edit
node proxy_validator.js
The script will check each proxy against the test URLs.
A progress bar will show the validation status.
Valid proxies will be saved to good.txt.
Errors will be logged in proxy_errors.log.
Example Output
bash
Copy
Edit
██████╗ ██████╗  ██████╗ ██╗  ██╗██╗   ██╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██████╔╝██████╔╝██║   ██║ ╚███╔╝  ╚████╔╝     ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
██╔═══╝ ██╔══██╗██║   ██║ ██╔██╗   ╚██╔╝      ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██║     ██║  ██║╚██████╔╝██╔╝ ██╗   ██║       ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

📌 Script by: hamednourzaei

🔍 Checking proxies | ██████████ | 100% | 200 checked
✅ 50 valid proxies saved! (good.txt)
Contributions
Feel free to fork the repository, make improvements, and submit pull requests. Contributions are welcome!
