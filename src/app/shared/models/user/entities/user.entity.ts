import { IntersectionType } from '@nestjs/swagger';

export class User {
  id: number;
  username: string;
  password: string;
}
export class UserRel {}
export class UserFull extends IntersectionType(User, UserRel) {}
