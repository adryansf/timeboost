import { PartialType } from '@nestjs/swagger';

// Dtos
import { CreateUserDto } from './create-user.dto';

// Validações
export class UpdateUserDto extends PartialType(CreateUserDto) {}
