import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not } from 'typeorm';
import { Task } from './entiity/task.entity';

@Injectable()
export class TaskReminderService {
  private readonly logger = new Logger(TaskReminderService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  @Cron('0 9 * * *')
  async handleCron() {
    this.logger.debug('🔍 Prüfe auf überfällige Tasks...');

    const now = new Date();

    const overdueTasks = await this.taskRepo.find({
      where: {
        dueDate: LessThan(now),
        status: Not('done'),
      },
      relations: ['user'],
    });

    if (overdueTasks.length === 0) {
      this.logger.log('✅ Keine überfälligen Tasks gefunden.');
      return;
    }

    this.logger.warn(
      `⚠️ Habe ${overdueTasks.length} überfällige Tasks gefunden!`,
    );

    for (const task of overdueTasks) {
      this.sendEmailReminder(task);
    }
  }

  private sendEmailReminder(task: Task) {
    const email = task.user.email;
    const subject = `Überfällig: "${task.title}"`;
    const dateString = task.dueDate?.toLocaleDateString('de-DE') ?? 'Unbekannt';

    console.log(`
    📧 --------------------------------------------------
    📧 AN:      ${email}
    📧 BETREFF: ${subject}
    📧 TEXT:    Hey ${task.user.name}, dein Task "${task.title}" war am ${dateString} fällig!
    📧          Bitte erledige ihn schnell.
    📧 --------------------------------------------------
    `);
  }
}
