import { PartialType } from '@nestjs/swagger';

// Dtos
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
