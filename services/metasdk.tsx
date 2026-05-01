import { AppEventsLogger } from 'react-native-fbsdk-next';

export const logMetaEvent = async (event: string, properties?: any) => {
    console.log("🚀 ~ logMetaEvent ~ properties:", properties)
    console.log("🚀 ~ logMetaEvent ~ event:", event)

    AppEventsLogger.logEvent(event, properties);

};