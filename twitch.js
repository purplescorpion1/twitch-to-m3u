const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const urlsToExtract = [
    'https://www.twitch.tv/stream1',
    'https://www.twitch.tv/stream2',
    // Add more URLs here if needed
];

// Delete existing twitch.m3u file if it exists
if (fs.existsSync('twitch.m3u')) {
    fs.unlinkSync('twitch.m3u');
    console.log('Existing twitch.m3u deleted.');
}

// Add #EXTM3U header to the file
fs.writeFileSync('twitch.m3u', '#EXTM3U\n');

async function runExtractions() {
    const browser = await puppeteer.launch();
    const promises = urlsToExtract.map(url => extractAndExportStream(url, browser));
    try {
        await Promise.all(promises);
    } catch (error) {
        console.error(error.message);
    } finally {
        await browser.close();
        console.log('All streams have been exported to twitch.m3u');
    }
}

async function extractAndExportStream(url, browser) {
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const channelName = (await page.title()).replace(' - Twitch', '');

        const streamlink = spawn('streamlink', [url, 'best', '--json', '--twitch-disable-ads', '--twitch-low-latency']);
        
        streamlink.stdout.on('data', data => {
            const jsonData = JSON.parse(data);
            const streamUrl = jsonData.url;
            if (streamUrl) {
                fs.appendFileSync(
                    'twitch.m3u',
                    `#EXTINF:-1 tvg-id="${channelName}" tvg-name="${channelName}" tvg-logo="https://1000logos.net/wp-content/uploads/2018/10/Twitch-logo.png" group-title="twitch",${channelName}\n${streamUrl}\n`
                );
                console.log(`${channelName} has been exported to the m3u`);
            } else {
                console.log(`No stream URL found for ${url}`);
            }
        });

        streamlink.stderr.on('data', err => {
            console.error(`Error extracting stream URL for ${url}: ${err.toString()}`);
        });

        await page.close();
    } catch (error) {
        console.error(`Error processing ${url}: ${error.message}`);
    }
}

runExtractions();
