import { Region } from './region';

export class Customer {
    id: number;
    name: string;
    lastname: string;
    email: string;
    createdAt: Date;
    image: string;
    region: Region;
}
