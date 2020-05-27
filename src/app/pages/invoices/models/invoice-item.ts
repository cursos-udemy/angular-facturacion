import { Item } from './item';

export class InvoiceItem {
    id: number;
    quantity: number = 1;
    item: Item;
    amount: number;

    public calculateAmount(): number {
        return this.quantity * this.item.price;
    }
}