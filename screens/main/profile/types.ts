export type SettingsRowProps = {
  title: string;
  icon: string;
  onPress: () => void;
  index: number;
  last: boolean;
};

export type SwitchSettingsRowProps = {
  title: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export type DropdownRowProps = {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
};

export type ModalItem = {
  id: number;
  title: string;
};
