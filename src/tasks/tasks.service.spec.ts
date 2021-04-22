import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_STATUS } from './task-status.enum';

const mockUser = {
  id: 12,
  username: 'Test User',
};
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksServer', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some value');

      expect(taskRepository.getTasks).not.toHaveBeenCalledWith();

      const filters: GetTasksFilterDto = {
        status: TASK_STATUS.IN_PROGRESS,
        search: 'Some search query',
      };

      const result = await taskRepository.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.fondOne() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask() and successfully and return the task', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const mockCreateTask: CreateTaskDto = {
        title: 'Test task',
        description: 'Test desc',
      };

      taskRepository.createTask.mockResolvedValue(mockCreateTask);

      const result = await tasksService.createTask(mockCreateTask, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockCreateTask,
        mockUser,
      );
      expect(result).toEqual(mockCreateTask);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTask(1, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
  });

  it('throws an error as task could not be found', () => {
    taskRepository.delete.mockResolvedValue({ affected: 0 });

    expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
