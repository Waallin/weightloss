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
  RecipeDetailScreen: { recipe: RecipeDetail };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
