import { IUser, userEntity } from "./user";
import { createEntity } from "../normalizer";

export type IGroup = {
  id: string;
  users: IUser[];
};

export const groupEntity = createEntity<IGroup>("groups", { users: [userEntity] });
