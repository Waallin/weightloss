export type ServiceItemType = {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
};

export type ServiceFilterButtonType = {
  id: number;
  title: string;
};

export type ServiceProviderItemType = {
  id: number;
  name: string;
  title: string;
  text: string;
  rating: number;
};

export type ServiceOptionType = {
  label: string;
  value: string;
  icon: string;
};
