import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
import { lastValueFrom } from 'rxjs';

let bspHash = '';
let shoonyaHash = '';
let samyamaHash = '';
@Injectable()
export class AppService {
  // private readonly logger = new Logger(TasksService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async handleBsp() {
    console.log('hitting handleBsp');
    const url =
      'https://api.ishafoundation.org/scheduleApi/api.php?option=com_program&v=2&format=json&task=filter&count=12&startrec=0&category=7&none=';
    const { data } = await lastValueFrom(new HttpService().get(url));
    console.log(data, 'handleBsp response');
    const newResponse = JSON.stringify(data);
    if (bspHash !== newResponse) {
      bspHash = newResponse;
      this.sendMail('bsp');
    }
  }

  async handleShoonya() {
    console.log('hitting handleShoonya');
    const url =
      'https://api.ishafoundation.org/scheduleApi/api.php?option=com_program&v=2&format=json&task=filter&count=12&startrec=0&category=13&none=';
    const { data } = await lastValueFrom(new HttpService().get(url));
    console.log(data, 'handleShoonya response');
    const newResponse = JSON.stringify(data);
    if (shoonyaHash !== newResponse) {
      shoonyaHash = newResponse;
      this.sendMail('shoonya');
    }
  }

  async handleSamayama() {
    console.log('hitting handleShoonya');
    const url =
      'https://api.ishafoundation.org/scheduleApi/api.php?option=com_program&v=2&format=json&task=filter&count=12&startrec=0&category=12&none';
    const { data } = await lastValueFrom(new HttpService().get(url));
    console.log(data, 'handleSamayama response');
    const newResponse = JSON.stringify(data);
    if (samyamaHash !== newResponse) {
      samyamaHash = newResponse;
      this.sendMail('samayama');
    }
  }

  async sendMail(type: string) {
    // Default options are marked with *
    console.log(`sending mail for ${type}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SENDER, // sender address
      to: process.env.EMAIL_RECEIVER, // list of receivers
      subject: `Register for ${type}`, // Subject line
      text: `Register for ${type}`, // plain text body, // html body
    });
    console.log(info);
    console.log('mail sent ');
  }
  @Cron('*/10 * * * *')
  async handleCron() {
    // this.sendMail();
    this.handleBsp();
    this.handleShoonya();
  }
}
