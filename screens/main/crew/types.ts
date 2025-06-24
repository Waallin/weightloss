export type CrewMemberItemType = {
  id: number;
  user_profile: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  pivot: {
    role: string;
  };
};
