export type RootStackParamList = {
  MainNavigator: undefined;
  Profile: undefined;
  MainStack: undefined;
  BoatRegistration: undefined;
  PreferenceView: undefined;
  Forecast: undefined;
  Boat: undefined;
  AddService: undefined;
  AddFuel: undefined;
  Notification: undefined;
  Crew: undefined;
  CreateProfile: { token: string };
  EditProfile: undefined;
  Location: undefined;
  Checklist: undefined;
  Analytics: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
