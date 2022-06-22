export interface IItem {
  tokenId: number;
  photo: any;
  title: string;
  location: string;
  description: string;
  timestamp: string;
  ownerHistory?: string[];
}