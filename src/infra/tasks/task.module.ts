import { Module } from '@nestjs/common';
import { DomainModule } from '@app/domain.module';
import { TaskService } from '@infra/tasks/task.service';

@Module({
  imports: [DomainModule],
  providers: [TaskService],
})
export class TaskModule {}
