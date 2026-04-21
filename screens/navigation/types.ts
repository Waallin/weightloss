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
  AuthNavigator: undefined;
  DietListScreen: undefined;
  AddDietScreen: undefined;
  ProfileScreen: undefined;
  PreferencesScreen: undefined;
  LogWeightScreen: undefined;
  SocialProofScreen: undefined;
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
  SocialProofScreen: undefined;
  Paywall: undefined;
  AuthScreen: undefined;
  HowItWork: undefined;
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
