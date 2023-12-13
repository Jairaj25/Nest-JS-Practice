import { CreateTaskDto } from './DTO/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './DTO/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
    try {
      const { status, search } = filterDto;
      let tasks = this.getAllTasks();

      if (status) {
        tasks = tasks.filter(
          (task) => task.status.toLowerCase() === status.toLowerCase(),
        );
      }

      if (search) {
        tasks = tasks.filter((task) => {
          if (
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      }

      return tasks;
    } catch (err) {
      throw err;
    }
  }

  getTaskbyID(id: string): Task {
    try {
      const foundTask = this.tasks.find((task) => task.id === id);
      if (!foundTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return foundTask;
    } catch (error) {
      throw error;
    }
  }

  createTasks(createTaskDto: CreateTaskDto): Task {
    try {
      const { title, description } = createTaskDto;
      const task: Task = {
        id: uuid(),
        title,
        description,
        status: TaskStatus.OPEN,
      };

      this.tasks.push(task);
      return task;
    } catch (err) {
      throw err;
    }
  }

  deleteTaskbyID(id: string): void {
    try {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    } catch (err) {
      throw err;
    }
  }

  updateTask(id: string, status: TaskStatus) {
    try {
      const task = this.getTaskbyID(id);
      task.status = status;
      return task;
    } catch (err) {
      throw err;
    }
  }
}
