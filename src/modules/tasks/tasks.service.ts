import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

// Repository
import { TaskRepository } from './repository/task.repository';
import { UserRepository } from '../users/repository/user.repository';

// Messages
import { MESSAGES } from '@/utils/messages';

@Injectable()
export class TasksService {
  constructor(
    private repoTask: TaskRepository,
    private repoUser: UserRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const existsUser = await this.repoUser.findById(createTaskDto.idUser);

    if (!existsUser)
      throw new NotFoundException(MESSAGES.exception.user.NotFound);

    return this.repoTask.create({ ...createTaskDto, completed: false });
  }

  findAll(): Promise<Task[]> {
    return this.repoTask.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repoTask.findById(id);

    if (!task) throw new NotFoundException(MESSAGES.exception.task.NotFound);

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.repoTask.findById(id);

    if (!task) throw new NotFoundException(MESSAGES.exception.task.NotFound);

    return this.repoTask.update(id, updateTaskDto);
  }

  async remove(id: number): Promise<Task> {
    const task = await this.repoTask.findById(id);

    if (!task) throw new NotFoundException(MESSAGES.exception.task.NotFound);

    return this.repoTask.delete(id);
  }
}
