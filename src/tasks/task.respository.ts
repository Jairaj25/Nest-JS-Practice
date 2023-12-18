import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './DTO/get-task-filter.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    try {
      const { status, search } = filterDto;
      const query = this.createQueryBuilder('task');

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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = this.create({
        title: title,
        description: description,
        status: TaskStatus.OPEN,
      });

      await this.save(task);

      return task;
    } catch (err) {
      throw err;
    }
  }
}
