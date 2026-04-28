//import Mixpanel class from the SDK
import { Mixpanel } from 'mixpanel-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create an instance of Mixpanel using your project token
// disable legacy autotrack mobile events
const trackAutomaticEvents = false;
const mixpanel = new Mixpanel('6121133a12b8a905284ed8948adcef67', trackAutomaticEvents);

    
export const initializeMixpanel = async () => { 
    await mixpanel.init();
};

export const identifyMixpanel = async (email: string) => {
    try {
        mixpanel.identify(email);
        console.log("User identified:", email);
    } catch (error) {
        console.log("Error in identify function:", error);
    }
};

export const trackMixpanelEvent = async (event: string, properties?: any) => {
    try {
        mixpanel.track(event, properties);
        console.log("Event sent:", event);
    } catch (error) {
        console.log("Error in track function:", error);
    }
};

