# twitch-to-m3u
Pulls the live stream of twitch channels into an m3u

## Choose method to run
Method 1 - Automatic on windows via the twitch API using python - Will pull live streams of the people you follow <br>
Method 2 - Use the nodejs script

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

See "How to setup"

If any errors manually install these dependencies
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
npm install puppeteer node-fetch ini readline-sync
```
<p></p>
Streamlink installed and available at path - https://streamlink.github.io/install.html

### How to run
```
node twitch_followed.js
```
<br>
It will ask for the <br>
User ID (Twitch username converted to ID) <br>
Twitch OAuth <br>
Access token <br>
ClientID <br>

### How to setup

Go to https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/ <br>
Enter your twitch username <br>
Convert twitch username to ID <br>
Copy User ID (Twitch username converted to ID) to Twitch_Followed to cmd/terminal <br>
<br>
Go to https://www.twitch.tv sign in and view a stream <br>
Open the developer tools of web browser (cntrl + shift + I) <br>
Go to the console <br>
<br>
Type (you may have to type confirmation to enable pasting of code into console first) <br>
```
document.cookie.split("; ").find(item=>item.startsWith("auth-token="))?.split("=")[1]
```
Copy the resulting string consisting of 30 alphanumerical characters without any quotations <br>
Copy Twitch OAuth to Twitch_Followed to cmd/terminal <br>
<br>
Go to https://twitchtokengenerator.com/ <br>
Under available token scopes set user:read:follows to Yes <br>
<br>
Scroll down and click generate token - sign in/authorize twitch to use <br>
Verify captcha <br>
<br>
Under generated tokens <br>
Copy Access Token to Twitch_Followed to cmd/terminal <br>
Copy ClientID to Twitch_Followed to cmd/terminal <br>
<br>
It will then output twitch_followed.m3u
<br>
### Optional steps
Create a dummy EPG using a dummy EPG script e.g. from https://github.com/yurividal/dummyepgxml
