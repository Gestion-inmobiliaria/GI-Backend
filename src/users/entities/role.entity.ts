import { Column, Entity, OneToMany } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { PermissionRoleEntity } from "./permission-role.entity";



@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 70, nullable: false, unique: true })
    name: string;

    @OneToMany(() => UserEntity, user => user.role)
    users: UserEntity[];

    @OneToMany(() => PermissionRoleEntity, permissionRole => permissionRole.role)
    permissions: PermissionRoleEntity[];
}
