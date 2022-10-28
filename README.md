
# DigitalNoticeBoard-Backend 
Backend Code For Digital Notice Board Application

#### Install Packages using NPM
```
npm install
```
#### Create An ENV File With .env in root Folder
```
URL="http:192.168.0.4:3000" / "production url" 
Secret="SessionSeceret for Express Session"
ONESIGNAL_APP_ID="Your Onesignal APP ID"
ONESIGNAL_USER_KEY="Your OneSignal User Key"
ONESIGNAL_APP_KEY="Your OneSignal APP key"
```
#### Create Initial Admin
```
Uncomment Line From 74 to 97 in routes/dashboard.js
Use Postman And Create Admin using Json Object And Post request end point with paraments email, password , cpasswords 
### Note : For Security Recomment Lines from 74 To 94
```
#### Start Backend Using Nodemon
```
npm run dev
```
#### Start Backend in Production
```
npm run start
```
