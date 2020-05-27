import { Region } from './region';
import { Invoice } from '../../invoices/models/invoice';

export class Customer {
    id: number;
    name: string;
    lastname: string;
    email: string;
    createdAt: Date;
    image: string;
    region: Region;
    invoices: Invoice[] = [];
}
