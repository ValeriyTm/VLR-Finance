import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { BullMQService } from '../bullmq/bullmq.service';
import { MinIOService } from '../minio/minio.service';
import puppeteer from 'puppeteer';
import { Job } from 'bullmq';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private bullMQ: BullMQService,
    private minio: MinIOService,
  ) {}

  async onModuleInit() {
    // Set up worker for report queue
    const { Worker } = await import('bullmq');
    const worker = new Worker(
      'reports',
      async (job: Job) => this.processReportJob(job),
      {
        connection: this.bullMQ.getConnection(),
        concurrency: 2,
      },
    );

    worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed:`, err);
    });
  }

  async submitReportJob(userId: string, reportType: string, params: any): Promise<string> {
    const job = await this.bullMQ.getReportQueue().add('generate-report', {
      userId,
      reportType,
      params,
    });

    return job.id!;
  }

  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.bullMQ.getReportQueue().getJob(jobId);
    if (!job) return null;

    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  private async processReportJob(job: Job): Promise<any> {
    const { userId, reportType, params } = job.data;
    this.logger.log(`Processing report job ${job.id} for user ${userId}`);

    try {
      // Generate PDF
      const pdfBuffer = await this.generatePDF(reportType, params);

      // Upload to MinIO
      const key = `reports/${userId}/${job.id}.pdf`;
      await this.minio.uploadFile(key, pdfBuffer);

      // Generate presigned URL
      const url = await this.minio.getPresignedUrl(key);

      return {
        reportUrl: url,
        key,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to process report job ${job.id}:`, error);
      throw error;
    }
  }

  private async generatePDF(reportType: string, params: any): Promise<Buffer> {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Generate HTML content based on report type
      const html = this.generateHTML(reportType, params);
      await page.setContent(html);

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private generateHTML(reportType: string, params: any): string {
    // Simplified HTML template
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VLR Finance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .report { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>VLR Finance ${reportType} Report</h1>
        <div class="report">
          <p>Report generated at: ${new Date().toISOString()}</p>
          <p>User ID: ${params.userId}</p>
          <p>Report Type: ${reportType}</p>
        </div>
      </body>
      </html>
    `;
  }
}
