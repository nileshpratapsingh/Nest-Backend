import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY:string|null = null;

export const Roles = (...role:string[])=> SetMetadata(ROLES_KEY,role);
