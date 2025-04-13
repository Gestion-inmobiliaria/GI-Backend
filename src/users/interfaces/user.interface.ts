import { GENDER } from "src/common/constants/gender";
import { IBranch } from "src/branches/interfaces/branch.interface";

export interface IUser {
  ci: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender: GENDER;
  address?: string;
  isActive: boolean;
  branch?: IBranch;
}
