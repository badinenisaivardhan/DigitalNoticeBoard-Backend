const OneSignal = require('@onesignal/node-onesignal');  
require('dotenv').config();

//Onesignal Creds Import
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID
const ONESIGNAL_USER_KEY = process.env.ONESIGNAL_USER_KEY
const ONESIGNAL_APP_KEY = process.env.ONESIGNAL_APP_KEY


const user_key_provider = {
    getToken() {
        return ONESIGNAL_USER_KEY;
    }
};

const app_key_provider = {
    getToken() {
        return ONESIGNAL_APP_KEY;
    }
};


async function SendNotification (title,body){

try {
    //Configuration Object
    let configuration = OneSignal.createConfiguration({
        authMethods: {
            user_key: {
                tokenProvider: user_key_provider
            },
            app_key: {
                tokenProvider: app_key_provider
            }
        }
    });

    client = new OneSignal.DefaultApi(configuration);
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID
    
    notification.headings = {
        en: title
      }  

    notification.contents = {
        en: body
      }
    
    notification.included_segments = {
        segment_name: "All"
    }
    
    notification.big_picture=''

    var result =  await client.createNotification(notification);
    return result
    } catch (error) {
        //console.error(error);
        return error;
    }
}
    
module.exports = {SendNotification}