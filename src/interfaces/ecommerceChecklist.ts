export interface EcommerceChecklist {
  id: number;
  orderIndex: number;
  name: string;
  category: string;
  color: string;
  items: EcommerceChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceChecklistItem {
  id: number;
  name: string;
  description: string | null;
  orderIndex: number;
}
