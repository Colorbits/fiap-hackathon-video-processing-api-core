import { randomInt } from 'crypto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @IsOptional()
  id?: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class FilterUserDto {
  @IsOptional()
  id?: number;
}

export class User {
  id?: number;
  name: string;
  email: string;
  password: string;

  constructor(userDto: UserDto) {
    this.id = userDto?.id || randomInt(999);
  }
}
