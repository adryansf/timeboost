import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Entities
import { TaskEntity } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiResponse({ type: TaskEntity })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return new TaskEntity(await this.tasksService.create(createTaskDto));
  }

  @ApiResponse({ type: TaskEntity, isArray: true })
  @Get()
  async findAll() {
    const tasks = await this.tasksService.findAll();
    return tasks.map((task) => new TaskEntity(task));
  }

  @ApiResponse({ type: TaskEntity })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new TaskEntity(await this.tasksService.findOne(+id));
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    await this.tasksService.update(+id, updateTaskDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.tasksService.remove(+id);
    return;
  }
}
