export type RootStackParamList = {
  MainNavigator: undefined;
  DietListScreen: undefined;
  AddDietScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
