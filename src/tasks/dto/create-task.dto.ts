import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: '標題不可為空' })
  title: string;

  @IsNotEmpty()
  description: string;
}
