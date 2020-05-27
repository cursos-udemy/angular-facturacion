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
}
