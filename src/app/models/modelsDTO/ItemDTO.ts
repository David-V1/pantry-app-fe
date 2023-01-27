import { Account } from "../Account";

export interface ItemDTO {
    id: number | null;
    name: string;
    image: string;
    weight: number;
    metric: string;
    quantity: number;
    calories: number;
    category: string;
    account: Account;
}