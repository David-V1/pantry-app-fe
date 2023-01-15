
export interface Recipe {
    id: number | null;
    name: string;
    image: string;
    //ingredients: string; moved to another Entity
    instructions: string;
}