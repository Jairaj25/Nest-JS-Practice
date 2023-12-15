import { CreateTaskDto } from './DTO/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './DTO/get-task-filter.dto';
import { TaskRepository } from './task.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    try {
      const { status, search } = filterDto;
      const query = this.taskRepository.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
          { search: `%${search}%` },
        );
      }

      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      throw err;
    }
  }
  // getAllTasks(): Task[] {
  //   try {
  //     return this.tasks;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
  //   try {
  //     const { status, search } = filterDto;
  //     let tasks = this.getAllTasks();

  //     if (status) {
  //       tasks = tasks.filter(
  //         (task) => task.status.toLowerCase() === status.toLowerCase(),
  //       );
  //     }

  //     if (search) {
  //       tasks = tasks.filter((task) => {
  //         if (
  //           task.title.toLowerCase().includes(search.toLowerCase()) ||
  //           task.description.toLowerCase().includes(search.toLowerCase())
  //         ) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     }

  //     return tasks;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = this.taskRepository.create({
        title: title,
        description: description,
        status: TaskStatus.OPEN,
      });

      await this.taskRepository.save(task);

      return task;
    } catch (err) {
      throw err;
    }
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
