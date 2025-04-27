import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';



@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ default: true })
    isActive: boolean;
}
