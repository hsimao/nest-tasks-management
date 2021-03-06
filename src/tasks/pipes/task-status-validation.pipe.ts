import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TASK_STATUS } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.values(TASK_STATUS);

  transform(value: any) {
    if (!value) {
      throw new BadRequestException('status is required');
    }

    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value} is an invalid status"`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx != -1;
  }
}
