export type RootStackParamList = {
  MainNavigator: undefined;
  DietListScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
