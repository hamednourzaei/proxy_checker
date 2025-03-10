const fs = require("fs");
const axios = require("axios");
const cliProgress = require("cli-progress");

const name = "hamednourzaei";

const proxyFile = "proxy_list_ips_only.txt";
const goodProxiesFile = "good.txt";
const errorLogFile = "proxy_errors.log";

const testUrls = ["https://httpbin.org/ip", "https://www.google.com"];
const timeoutMs = 120 * 1000;
const maxThreads = 100;

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
];

const proxyPattern = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{2,5})$/;

const proxies = fs
  .readFileSync(proxyFile, "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => proxyPattern.test(line));

if (proxies.length === 0) {
  process.exit(1); // Exit without any output if no valid proxies are found
}

let checkedCount = 0;

const errorLogStream = fs.createWriteStream(errorLogFile, { flags: "a" });

const progressBar = new cliProgress.SingleBar(
  {
    format:
      "🔍 Checking proxies | {bar} | {percentage}% | {total} checked | {eta}s left",
    barCompleteChar: "█",
    barIncompleteChar: "░",
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);

progressBar.start(proxies.length, 0);

let activeThreads = 0;

const MAX_RETRIES = 3;

async function checkProxy(proxy, retries = 0) {
  const match = proxyPattern.exec(proxy);
  if (!match) return;

  const [ip, port] = match.slice(1);
  const proxyUrl = `http://${ip}:${port}`;

  for (const url of testUrls) {
    try {
      const response = await axios.get(url, {
        proxy: { host: ip, port: parseInt(port), protocol: "http" },
        timeout: timeoutMs,
        headers: {
          "User-Agent":
            userAgents[Math.floor(Math.random() * userAgents.length)],
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
        },
      });

      if (response.status === 200) {
        // Immediately save valid proxy to file
        fs.appendFileSync(goodProxiesFile, proxy + "\n", "utf-8");
        console.log(`✅ Valid proxy: ${proxy}`);
        return;
      }
    } catch (error) {
      if (retries < MAX_RETRIES) {
        return checkProxy(proxy, retries + 1); // Retry without any logging
      } else {
        const errorMessage = `❌ Invalid proxy: ${proxy} - Error: ${error.message}`;
        errorLogStream.write(errorMessage + "\n"); // Only log to file, no console output
      }
    }
  }

  checkedCount++;
  progressBar.update(checkedCount);
}

async function checkProxyWithLimit(proxy) {
  while (activeThreads >= maxThreads) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for threads to reduce
  }

  activeThreads++;
  await checkProxy(proxy);
  activeThreads--;
}

(async () => {
  const promises = [];

  for (const proxy of proxies) {
    if (promises.length >= maxThreads) {
      await Promise.race(promises);
      promises.splice(
        promises.findIndex((p) => p.isResolved),
        1
      );
    }

    const p = checkProxyWithLimit(proxy).then(() => (p.isResolved = true));
    promises.push(p);
  }

  await Promise.all(promises);

  progressBar.stop();
  errorLogStream.end();
})();
