import { CreateTaskDto } from './DTO/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './DTO/get-task-filter.dto';
import { TaskRepository } from './task.respository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const foundTask = await this.taskRepository.findOneBy({ id: id });

      if (!foundTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return foundTask;
    } catch (err) {
      throw err;
    }
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskbyId(id: string): Promise<void> {
    try {
      const DeletedTask = await this.taskRepository.delete({ id: id });
      if (DeletedTask.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (err) {
      throw err;
    }
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    try {
      const task = await this.getTaskById(id);
      task.status = status;
      await this.taskRepository.save(task);
      return task;
    } catch (err) {
      throw err;
    }
  }
}
