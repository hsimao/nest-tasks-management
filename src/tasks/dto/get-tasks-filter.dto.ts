import { TASK_STATUS } from '../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(Object.values(TASK_STATUS))
  status: TASK_STATUS;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
