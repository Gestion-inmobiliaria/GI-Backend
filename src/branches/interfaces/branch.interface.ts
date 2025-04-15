import { UserEntity } from "src/users/entities/user.entity";

// Definición local de IBase para evitar problemas de importación
export interface IBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBranch extends IBase {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive: boolean;
  users?: UserEntity[];
} 