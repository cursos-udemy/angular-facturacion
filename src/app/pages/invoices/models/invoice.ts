import { Customer } from '../../customers/models/customer';
import { InvoiceItem } from './invoice-item';

export class Invoice {
	id: number;
	createdAt: Date;
	description: string;
	observation: string;
	customer: Customer;
	items: InvoiceItem[] = [];
	total: number;

	calculateTotal(): number {
		this.total = 0;
		this.items.forEach((item: InvoiceItem) => {
			this.total += item.calculateAmount();
		});
		return this.total;
	}
}
