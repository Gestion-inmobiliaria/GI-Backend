import { Column, Entity, OneToMany } from "typeorm";
import { IOwner } from "../interfaces/owner.interface";
import { BaseEntity } from "@/common/entities/base.entity";
import { PropertyOwnerEntity } from "@/property/entities/property_owner.entity";



@Entity({ name: "owner" })
export class OwnerEntity extends BaseEntity implements IOwner {
    @Column({ type:'varchar', unique: true, nullable: false, length: 20 })
    ci: string;

    @Column({type:'varchar', nullable: false, length: 100 })
    name: string;

    @Column({type:'varchar', nullable: false, length: 100, unique: true })
    email: string;

    @Column({type:'varchar', nullable: false })
    phone: string;

    @Column({type:'boolean', default: true })
    isActive: boolean;

    /*relacion*/
    @OneToMany(()=>PropertyOwnerEntity,(property_owner)=> property_owner.owner,{onDelete: 'CASCADE'})
    property_owner: PropertyOwnerEntity[];
}
