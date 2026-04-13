export type RootStackParamList = {
  MainNavigator: undefined;
  DietListScreen: undefined;
  AddDietScreen: undefined;
  ProfileScreen: undefined;
  PreferencesScreen: undefined;
  LogWeightScreen: undefined;
  ArticleScreen: {
    article?: {
      id: number;
      title: string;
      description: string;
      color: string;
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
