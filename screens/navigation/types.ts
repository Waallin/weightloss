export type RootStackParamList = {
  MainNavigator: undefined;
  Profile: undefined;
  MainStack: undefined;
  BoatRegistration: undefined;
  PreferenceView: undefined;
  Forecast: undefined;
  Boat: undefined;
  AddMaintance: undefined;
  AddFuel: undefined;
  Notification: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
