export type CrewMemberItemType = {
  id: number;
  phone_number: string;
  user_profile: {
    full_name: string;
    email: string;
  };
  pivot: {
    role: string;
  };
};
