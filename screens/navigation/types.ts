export type RootStackParamList = {
  MainNavigator: undefined;
  Profile: undefined;
  MainStack: undefined;
  BoatRegistration: undefined;
  PreferenceView: undefined;
  Forecast: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
