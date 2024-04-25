# twitch-to-m3u
Pulls the live stream of twitch channels into an m3u

### Requirements
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

### How to run
```
node twitch.js
```
Output will be twitch.m3u containing available live streams <br>
Run script each time the streamer you want to watch goes live


Add/remove urls as required

### Optional steps
Create a dummy EPG using a dummy EPG script e.g. from https://github.com/yurividal/dummyepgxml
