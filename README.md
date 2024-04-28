# twitch-to-m3u
Pulls the live stream of twitch channels into an m3u

## Choose method to run
Method 1 - Automatic on windows via the twitch API using python - Will pull live streams of the people you follow <br>
Method 2 - Manual on any opperating system using node - Will pull live streams of the URLs you add to script

### Method 1 Requirements
Download the exe from the releases section https://github.com/purplescorpion1/twitch-to-m3u/releases <br>
python with pip only if you get errors about dependencies so you can manually install them

### How to run
Note if you used a previous version you may have to rename config.ini to anything else so you can recreate it. You can copy and paste existing details from it into the cmd window when asked and then add anything additional <br>

<p> Run Twitch_Followed.exe <br>
It will ask for the <br> 
Access token <br>
Client ID <br>
User ID <br>
Twitch OAuth <br>
 <br>
Go to https://twitchtokengenerator.com/  <br>
Under available token scopes set user:read:follows to Yes  <br>
 <br>
Scroll down and click generate token - sign in/authorize twitch to use  <br>
Verify captcha  <br>
 <br>
Under generated tokens  <br> 
Copy access token to Twitch_Followed to cmd window  <br>
Copy client id to Twitch_Followed to cmd window  <br>
 <br>
Go to https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/  <br>
Enter your twitch username  <br>
Convert twitch username to ID  <br>
Copy Twitch ID to Twitch_Followed to cmd window  <br>
 <br>
Go to https://www.twitch.tv/ sign in and view a stream <br>
Open the developer tools of web browser (ctrl + shift + I) <br>
Go to the console <br>
 <br>
Type (you may have to type confirmation to enable pasting of code into console first)  <br>
 
```
document.cookie.split("; ").find(item=>item.startsWith("auth-token="))?.split("=")[1]
```

Copy the resulting string consisting of 30 alphanumerical characters without any quotations <br>
Copy TwitchOAuth to Twitch_Followed to cmd window <br>
 <br>

It will then output twitch_followed.m3u
 <br>
<br>
If you need to change your token details etc you can by either editing config.ini or delete config.ini and start again <br>
<br>
If any errors in running the exe you can manually install the dependencies 
```
pip install requests
pip install configparser
pip install streamlink 
```

### Method 2 Requirements
Node.js https://nodejs.org/en

### How to install
``` 
git clone https://github.com/purplescorpion1/twitch-to-m3u.git
```
<p></p>

```
cd twitch-to-m3u
```
<p></p>

```
npm install puppeteer
```
<p></p>

```
npm install -g streamlink
```

### How to configure
Open twitch.js with notepad++ <br>
Change
```
  'https://www.twitch.tv/stream1',
  'https://www.twitch.tv/stream2',
```
to the actual URLs of the stream (change stream1 and stream2 to the username of the streamers at the end of the URL) <br>
<br>
Add additional URLs as required <br>
You can leave URLs of channels that are not currently live in the script as it will only pull the channels that it finds an active live stream

### Optional configure
You can add your twitch0auth in to remove the commercial break in progress screen from the channels you subscribe to <br>
Go to https://www.twitch.tv/ sign in and view a stream <br>
Open the developer tools of web browser (ctrl + shift + I) <br>
Go to the console <br>
 <br>
Type (you may have to type confirmation to enable pasting of code into console first)  <br>

```
document.cookie.split("; ").find(item=>item.startsWith("auth-token="))?.split("=")[1]
```

Copy the resulting string consisting of 30 alphanumerical characters without any quotations <br>

Open live.py with notepad++ (or any coding text editor) <br>
Change
```
streamlink_process = subprocess.Popen(['streamlink', url, 'best', '--json', '--twitch-disable-ads', '--twitch-low-latency'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
```
To 
```
streamlink_process = subprocess.Popen(['streamlink', '--twitch-api-header=Authorization=OAuth abcdefghigklmnop', 'twitch.tv/' + channelName, 'best', '--json', '--twitch-disable-ads', '--twitch-low-latency'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
```
Changing abcdefghigklmnop to your twitchOauth (there is space between OAuth and your token code) 

### How to run
```
node twitch.js
```
Output will be twitch.m3u containing available live streams <br>
Run script each time the streamer you want to watch goes live


Add/remove urls as required

### Optional steps
Create a dummy EPG using a dummy EPG script e.g. from https://github.com/yurividal/dummyepgxml
