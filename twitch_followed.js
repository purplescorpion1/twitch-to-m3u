const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ini = require('ini');

const CONFIG_FILE = 'config.ini';

let configData = {};

async function main() {
    // Check if the config file exists and load it
    await loadConfig();

    // If no valid config is found, prompt for user input
    if (!configData.AccessToken || !configData.ClientID || !configData.UserID || !configData.OAuthToken) {
        configData = await promptForConfig();
        saveConfig(configData); // Save to config.ini for future runs
    }

    console.log('Using the following credentials:');
    console.log(`Access Token: ${configData.AccessToken}`);
    console.log(`Client ID: ${configData.ClientID}`);
    console.log(`User ID: ${configData.UserID}`);
    console.log(`OAuth Token: ${configData.OAuthToken}`);

    const onlineChannels = await fetchOnlineChannels(configData.ClientID, configData.AccessToken, configData.UserID, configData.OAuthToken);

    if (!onlineChannels || onlineChannels.length === 0) {
        console.log('No online channels found.');
        return;
    }

    console.log(`Found ${onlineChannels.length} online channels.`);

    // Delete existing twitch_followed.m3u file if it exists
    if (fs.existsSync('twitch_followed.m3u')) {
        fs.unlinkSync('twitch_followed.m3u');
        console.log('Existing twitch_followed.m3u deleted.');
    }

    // Add #EXTM3U header to the file
    fs.writeFileSync('twitch_followed.m3u', '#EXTM3U\n');

    const browser = await puppeteer.launch();
    const promises = onlineChannels.map(async (channelName) => {
        try {
            await extractAndExportStream(channelName, browser, configData.OAuthToken);
            console.log(`${channelName} has been exported to the m3u`);
        } catch (error) {
            console.error(`Error exporting ${channelName}: ${error.message}`);
        }
    });

    try {
        // Wait for all streams to be processed
        await Promise.all(promises);
        console.log('All streams have been exported to twitch_followed.m3u');
    } catch (error) {
        console.error('Error during stream extraction:', error.message);
    } finally {
        await browser.close();
        console.log('Export completed.');
    }
}

async function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        const config = ini.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        if (config.AccessToken && config.ClientID && config.UserID && config.OAuthToken) {
            configData = {
                AccessToken: config.AccessToken,
                ClientID: config.ClientID,
                UserID: config.UserID,
                OAuthToken: config.OAuthToken
            };
            console.log('Configuration loaded from config.ini');
        }
    }
}

async function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, ini.stringify(config));
    console.log('Configuration saved to config.ini');
}

async function promptForConfig() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = question => new Promise(resolve => rl.question(question, resolve));

    console.log('Enter the following Twitch API credentials:');
    const userId = await ask('User ID (Twitch username converted to ID): ');
    const oauthToken = await ask('Twitch OAuth Token: '); // <-- Prompt OAuth Token AFTER User ID
    const accessToken = await ask('Access Token: ');
    const clientId = await ask('Client ID: ');

    rl.close();

    // Validate that the user provided all necessary inputs
    if (userId && oauthToken && accessToken && clientId) {
        return {
            AccessToken: accessToken,
            ClientID: clientId,
            UserID: userId,
            OAuthToken: oauthToken
        };
    }

    console.error('Invalid input. All fields are required.');
    return null;
}

async function fetchOnlineChannels(clientId, accessToken, userId, oauthToken) {
    const url = `https://api.twitch.tv/helix/streams/followed?user_id=${userId}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Twitch API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data.map(channel => channel.user_name);
    } catch (error) {
        console.error('Error fetching online channels:', error.message);

        // Handle unauthorized error and prompt user for valid OAuth token
        if (error.message.includes('Unauthorized')) {
            console.log('Unauthorized access. Please ensure that your OAuth token is correct.');
            const newOauthToken = await promptForNewOauthToken();
            return fetchOnlineChannels(clientId, accessToken, userId, newOauthToken);
        }

        return null;
    }
}

async function promptForNewOauthToken() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = question => new Promise(resolve => rl.question(question, resolve));

    const oauthToken = await ask('Enter your OAuth Token: ');

    rl.close();
    return oauthToken;
}

async function extractAndExportStream(channelName, browser, oauthToken) {
    try {
        const page = await browser.newPage();
        const url = `https://www.twitch.tv/${channelName}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const streamlink = spawn('streamlink', [
            `--twitch-api-header=Authorization=OAuth ${oauthToken}`,
            url,
            'best',
            '--json',
            '--twitch-disable-ads',
            '--twitch-low-latency'
        ]);

        streamlink.stdout.on('data', data => {
            try {
                const jsonData = JSON.parse(data);
                const streamUrl = jsonData.url;

                if (streamUrl) {
                    fs.appendFileSync(
                        'twitch_followed.m3u',
                        `#EXTINF:-1 tvg-id="${channelName}" tvg-name="${channelName}" tvg-logo="https://1000logos.net/wp-content/uploads/2018/10/Twitch-logo.png" group-title="twitch",${channelName}\n${streamUrl}\n`
                    );
                } else {
                    console.log(`No stream URL found for ${channelName}`);
                }
            } catch (err) {
                console.error('Error parsing streamlink output:', err.message);
            }
        });

        streamlink.stderr.on('data', err => {
            console.error(`Error extracting stream URL for ${channelName}: ${err.toString()}`);
        });

        await page.close();
    } catch (error) {
        console.error(`Error processing ${channelName}: ${error.message}`);
    }
}

main();
