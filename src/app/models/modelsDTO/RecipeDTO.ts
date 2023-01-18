import { Account } from "../Account";

export interface RecipeDTO {
    id: number | null;
    name: string;
    image: string;
    instructions: string;
    account: Account;
}