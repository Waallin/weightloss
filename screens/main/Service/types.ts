export type ServiceItemType = {
  id: number;
  title: string;
  description: string;
  category: string;
  cost: string;
  created_at: string;
  receipt_url: string | null;
  registered_by: string;
  registered_by_email: string;
  service_provider: string;
  type: string;
  status?: "completed" | "pending" | "overdue";
  hours?: string;
  receipt_attached?: boolean;
  parts_used?: string[];
  next_due?: string;
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
