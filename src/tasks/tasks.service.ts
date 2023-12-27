import { CreateTaskDto } from './DTO/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './DTO/get-task-filter.dto';
import { TaskRepository } from './task.respository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const foundTask = await this.taskRepository.findOneBy({ id, user });

      if (!foundTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return foundTask;
    } catch (err) {
      throw err;
    }
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskbyId(id: string, user: User): Promise<void> {
    try {
      const DeletedTask = await this.taskRepository.delete({ id, user });
      if (DeletedTask.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (err) {
      throw err;
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    try {
      const task = await this.getTaskById(id, user);
      task.status = status;
      await this.taskRepository.save(task);
      return task;
    } catch (err) {
      throw err;
    }
  }
}
