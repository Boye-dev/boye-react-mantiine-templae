import { RolesEnum } from '@/constants/roles';

export interface LoginInterface {
  username: string;
  password: string;
}

export interface SignUpInterface {
  email: string;

  service?: keyof typeof ServicesEnum | null;

  password: string;

  phoneNumber: string;

  role: keyof typeof RolesEnum;

  confirmPassword: string;
}
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum StatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export enum ServicesEnum {
  CLEANER = 'CLEANER',
  LAUNDRY = 'LAUNDRYS',
  HOUSE_KEEPING = 'HOUSE_KEEPING',
}

export interface IUser {
  _id: string;

  firstName?: string;

  middleName?: string;

  phoneNumber: string;

  lastName?: string;

  companyName?: string;

  gender?: keyof typeof GenderEnum;

  kycCompleted: boolean;

  currentKycStep: number;

  address?: string;

  status: keyof typeof StatusEnum;

  profilePicture?: string;

  dateOfBirth?: Date;

  verified: boolean;

  email: string;

  password: string;

  role: keyof typeof RolesEnum;

  displayName?: string;

  rcNumber?: string;

  about?: string;

  service?: keyof typeof ServicesEnum;

  coverageArea?: string[];

  responseTime?: string;

  relevantPhotos?: string[];

  facebook?: string;

  instagram?: string;

  twitter?: string;

  linkdeln?: string;

  verificationToken: string;

  resetPasswordToken: string;

  resetPasswordExpires: Date;
}
