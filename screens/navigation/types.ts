export type RootStackParamList = {
  MainNavigator: undefined;
  Profile: undefined;
  MainStack: undefined;
  BoatRegistration: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
