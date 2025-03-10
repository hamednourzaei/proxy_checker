// This script checks proxies to verify if they work by sending HTTP requests to a test URL (httpbin.org/ip).
// این اسکریپت پروکسی‌ها را بررسی می‌کند تا تایید کند که آیا آن‌ها با ارسال درخواست‌های HTTP به یک URL تست (httpbin.org/ip) کار می‌کنند یا خیر.

// It uses the axios library for making HTTP requests and cli-progress to show the progress of proxy validation.
// این اسکریپت از کتابخانه axios برای ارسال درخواست‌های HTTP و از cli-progress برای نمایش پیشرفت اعتبارسنجی پروکسی استفاده می‌کند.

const fs = require("fs"); // Module for reading and writing files
const axios = require("axios"); // Module for making HTTP requests
const cliProgress = require("cli-progress"); // Module for showing progress bars in the CLI

// Creator's name, customizable for each user
// نام سازنده، قابل تنظیم برای هر کاربر
const name = "hamednourzaei";

// Banner to show the creator's information when the script runs
// بنر برای نمایش اطلاعات سازنده هنگام اجرای اسکریپت
const banner = `
██████╗ ██████╗  ██████╗ ██╗  ██╗██╗   ██╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██████╔╝██████╔╝██║   ██║ ╚███╔╝  ╚████╔╝     ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
██╔═══╝ ██╔══██╗██║   ██║ ██╔██╗   ╚██╔╝      ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██║     ██║  ██║╚██████╔╝██╔╝ ██╗   ██║       ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

📌 Script by: ${name}
`;

// Output the banner at the start of the script to provide clear information about the creator
// بنر را در ابتدای اسکریپت نمایش می‌دهد تا اطلاعات واضحی از سازنده را نمایش دهد
console.log(banner);

// Files for reading and writing proxy lists and errors
// فایل‌هایی برای خواندن و نوشتن لیست پروکسی‌ها و خطاها
const proxyFile = "proxy_list_ips_only.txt"; // Path to the file containing proxies
const goodProxiesFile = "good.txt"; // Path to save valid proxies
const errorLogFile = "proxy_errors.log"; // Log file for invalid proxies

// List of URLs to test proxies against
// لیستی از URL‌ها برای تست پروکسی‌ها
const testUrls = ["https://httpbin.org/ip"];

// Timeout duration for each request in milliseconds (2 minutes)
// مدت زمان تایم‌اوت برای هر درخواست به میلی‌ثانیه (۲ دقیقه)
const timeoutMs = 120 * 1000;

// Max number of simultaneous threads for proxy checking
// حداکثر تعداد نخ‌های همزمان برای بررسی پروکسی
const maxThreads = 100;

// List of User-Agent strings to simulate different browsers
// لیست رشته‌های User-Agent برای شبیه‌سازی مرورگرهای مختلف
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
];

// Regular expression pattern for validating proxy format (IP:PORT)
// الگوی عبارت منظم برای اعتبارسنجی فرمت پروکسی (IP:PORT)
const proxyPattern = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{2,5})$/;

// Reading and validating proxies from the proxy list file
// خواندن و اعتبارسنجی پروکسی‌ها از فایل لیست پروکسی‌ها
const proxies = fs
  .readFileSync(proxyFile, "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => proxyPattern.test(line));

// If no valid proxies are found, print a message and exit the script
// اگر هیچ پروکسی معتبر پیدا نشد، پیامی را چاپ کرده و از اسکریپت خارج می‌شود
if (proxies.length === 0) {
  console.log("⚠ No valid proxies found!");
  process.exit(1);
}

// Initialize an empty array to store valid proxies
// یک آرایه خالی برای ذخیره پروکسی‌های معتبر مقداردهی اولیه می‌شود
const goodProxies = [];
let checkedCount = 0;

// Create a writable stream for logging errors
// ایجاد یک جریان نوشتنی برای ثبت خطاها
const errorLogStream = fs.createWriteStream(errorLogFile, { flags: "a" });

// Create a progress bar to visually track the proxy checking progress
// ایجاد یک نوار پیشرفت برای ردیابی بصری پیشرفت بررسی پروکسی‌ها
const progressBar = new cliProgress.SingleBar(
  {
    format: "🔍 Checking proxies | {bar} | {percentage}% | {total} checked",
    barCompleteChar: "█", // Character for completed progress
    barIncompleteChar: "░", // Character for incomplete progress
    hideCursor: true, // Hide cursor during progress display
  },
  cliProgress.Presets.shades_classic // Classic progress bar preset
);

// Start the progress bar with the total number of proxies
// نوار پیشرفت با تعداد کل پروکسی‌ها شروع می‌شود
progressBar.start(proxies.length, 0);

// Function to check each proxy
// تابعی برای بررسی هر پروکسی
async function checkProxy(proxy) {
  const match = proxyPattern.exec(proxy);
  if (!match) return; // Skip invalid proxies
  // در صورتی که پروکسی معتبر نباشد، از آن عبور می‌کند

  const [ip, port] = match.slice(1); // Extract IP and port from proxy
  // استخراج IP و پورت از پروکسی
  const proxyUrl = `http://${ip}:${port}`; // Construct proxy URL
  // ساخت URL پروکسی

  // Test the proxy with the defined URLs
  // تست پروکسی با URL‌های تعریف‌شده
  for (const url of testUrls) {
    try {
      // Send a GET request to the test URL using the proxy
      // ارسال درخواست GET به URL تست با استفاده از پروکسی
      const response = await axios.get(url, {
        proxy: { host: ip, port: parseInt(port), protocol: "http" }, // Proxy settings
        timeout: timeoutMs, // Set request timeout
        headers: {
          "User-Agent":
            userAgents[Math.floor(Math.random() * userAgents.length)], // Randomly select a user-agent
          "Accept-Language": "en-US,en;q=0.9", // Set the accept language for requests
          Connection: "keep-alive", // Keep connection alive for reuse
        },
      });

      // If the request is successful (status 200), consider the proxy valid
      // اگر درخواست موفقیت‌آمیز بود (وضعیت ۲۰۰)، پروکسی را معتبر در نظر می‌گیرد
      if (response.status === 200) {
        goodProxies.push(proxy);
        console.log(`✅ Valid proxy: ${proxy}`); // Log valid proxy
        break; // Stop further checks for this proxy once it's valid
      }
    } catch (error) {
      // If an error occurs, log it to the error log file
      // اگر خطا رخ دهد، آن را در فایل ثبت خطا ثبت می‌کند
      errorLogStream.write(
        `❌ Invalid proxy: ${proxy} - Error: ${error.message}\n`
      );
    }
  }

  // Increment the checked count and update the progress bar
  // تعداد بررسی‌شده را افزایش داده و نوار پیشرفت را بروزرسانی می‌کند
  checkedCount++;
  progressBar.update(checkedCount);
}

// Main function to process proxies with concurrency control
// تابع اصلی برای پردازش پروکسی‌ها با کنترل همزمانی
(async () => {
  const promises = []; // Array to hold the promises for proxy checks
  // آرایه‌ای برای ذخیره پرامیس‌ها برای بررسی پروکسی‌ها

  // Iterate through all the proxies and check them concurrently
  // پیمایش از طریق تمام پروکسی‌ها و بررسی آن‌ها به صورت همزمان
  for (const proxy of proxies) {
    // Limit the number of concurrent proxy checks to avoid overwhelming the system
    // محدود کردن تعداد بررسی‌های همزمان پروکسی‌ها برای جلوگیری از بار زیاد روی سیستم
    if (promises.length >= maxThreads) {
      await Promise.race(promises); // Wait for one of the promises to resolve
      promises.splice(
        promises.findIndex((p) => p.isResolved), // Remove the resolved promise
        1
      );
    }
    const p = checkProxy(proxy).then(() => (p.isResolved = true)); // Mark promise as resolved after proxy check
    promises.push(p); // Add the promise to the array
  }

  // Wait for all proxy checks to complete
  // منتظر می‌ماند تا تمام بررسی‌های پروکسی تمام شوند
  await Promise.all(promises);

  // Stop the progress bar and finalize the error log
  // نوار پیشرفت را متوقف کرده و ثبت خطا را تکمیل می‌کند
  progressBar.stop();
  errorLogStream.end();

  // Save the valid proxies to a file
  // ذخیره پروکسی‌های معتبر در یک فایل
  fs.writeFileSync(goodProxiesFile, goodProxies.join("\n"), "utf-8");
  console.log(
    `\n✅ ${goodProxies.length} valid proxies saved! (${goodProxiesFile})` // Final message with the result
  );
})();
