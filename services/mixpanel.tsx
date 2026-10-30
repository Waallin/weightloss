//import Mixpanel class from the SDK
import { Mixpanel } from 'mixpanel-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create an instance of Mixpanel using your project token
// disable legacy autotrack mobile events
const trackAutomaticEvents = false;
const PROD_TOKEN = '6121133a12b8a905284ed8948adcef67';
// Dev-byggen skickar inte till produktionsprojektet. Sätt EXPO_PUBLIC_MIXPANEL_DEV_TOKEN för att testa mot ett eget projekt.
const DEV_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_DEV_TOKEN;
const trackingEnabled = !__DEV__ || !!DEV_TOKEN;
const mixpanel = new Mixpanel(__DEV__ ? (DEV_TOKEN ?? PROD_TOKEN) : PROD_TOKEN, trackAutomaticEvents);

    
export const initializeMixpanel = async () => { 
    if (!trackingEnabled) {
        console.log("Mixpanel disabled in dev (no EXPO_PUBLIC_MIXPANEL_DEV_TOKEN)");
        return;
    }
    await mixpanel.init();
    console.log("Mixpanel initialized");
};

export const identifyMixpanel = async (email: string) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.identify(email);
        console.log("User identified:", email);
    } catch (error) {
        console.log("Error in identify function:", error);
    }
};

export const trackMixpanelEvent = async (event: string, properties?: any) => {
    console.log("Event tracked:", event, properties);
    if (!trackingEnabled) return;
    try {
        mixpanel.track(event, properties);
    } catch (error) {
        console.log("Error in track function:", error);
    }
};

export const setMixpanelPeopleProperty = async (property: string, value: any) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.getPeople().set(property, value);
        console.log("Property set:", property, value);
    } catch (error) {
        console.log("Error in set function:", error);
    }
};


export const setMixpanelPeopleProperties = async (properties: Record<string, any>) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.getPeople().set(properties);
    } catch (error) {
        console.log("Error in set function:", error);
    }
};

export const setMixpanelPeopleOnce = async (properties: Record<string, any>) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.getPeople().setOnce(properties);
    } catch (error) {
        console.log("Error in setOnce function:", error);
    }
};

export const incrementMixpanelPeople = async (property: string, by = 1) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.getPeople().increment(property, by);
    } catch (error) {
        console.log("Error in increment function:", error);
    }
};

export const registerMixpanelSuperProperties = async (properties: Record<string, any>) => {
    if (!trackingEnabled) return;
    try {
        mixpanel.registerSuperProperties(properties);
    } catch (error) {
        console.log("Error in registerSuperProperties function:", error);
    }
};

export const resetMixpanel = async () => {
    if (!trackingEnabled) return;
    try {
        mixpanel.reset();
    } catch (error) {
        console.log("Error in reset function:", error);
    }
};
