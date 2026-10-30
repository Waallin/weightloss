export type RecipeDetailLine = {
  id?: string;
  text: string;
};

export type RecipeDetail = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  points?: string;
  kudos?: string;
  ingredients?: RecipeDetailLine[];
  instructions?: RecipeDetailLine[];
};

export type RootStackParamList = {
  MainNavigator: undefined;
  Paywall: undefined;
  AuthNavigator: undefined;
  DietListScreen: { initialTab?: "food" | "recipes" };
  ScanFoodScreen:
    | { fromFirstDayGuide?: boolean; debugImagePath?: string; debugHold?: boolean }
    | undefined;
  FirstDayGuide: { mealLogged?: boolean } | undefined;
  AddDietScreen: undefined;
  ManualFoodScreen: { fromFirstDayGuide?: boolean } | undefined;
  SettingsScreen: undefined;
  MoveGoalReward: { steps: number };
  ProfileScreen: undefined;
  PreferencesScreen: undefined;
  LogWeightScreen: undefined;
  Auth: undefined;
  ArticleScreen: {
    article?: {
      id: number;
      title: string;
      description: string;
      color: string;
    };
  };
  RecipeDetailScreen: { recipe: RecipeDetail };
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Paywall: undefined;
  AuthScreen: undefined;
  ProfileDetails: undefined;
  Auth: undefined;
  PermissionScreen: undefined;
  MainStack: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
