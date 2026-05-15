import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SePayService {
  constructor(private readonly configService: ConfigService) {}

  public createQrUrl(data: {
    amount: number;
    transactionCode: string;
  }): string {
    const accountNumber = this.getRequiredEnv('SEPAY_ACCOUNT_NUMBER');
    const bankCode = this.getRequiredEnv('SEPAY_BANK_CODE');
    const template = this.configService.get<string>('SEPAY_QR_TEMPLATE');
    const descriptionPrefix =
      this.configService.get<string>('SEPAY_DESCRIPTION_PREFIX') || '';
    const description = `${descriptionPrefix}${data.transactionCode}`.trim();

    const params = new URLSearchParams({
      acc: accountNumber,
      bank: bankCode,
      amount: String(Math.round(data.amount)),
      des: description,
    });

    if (template) {
      params.set('template', template);
    }

    return `https://qr.sepay.vn/img?${params.toString()}`;
  }

  public getTransferContent(transactionCode: string): string {
    const descriptionPrefix =
      this.configService.get<string>('SEPAY_DESCRIPTION_PREFIX') || '';
    return `${descriptionPrefix}${transactionCode}`.trim();
  }

  public getBankInfo(): {
    bankCode: string;
    accountNumber: string;
    accountName?: string;
  } {
    return {
      bankCode: this.getRequiredEnv('SEPAY_BANK_CODE'),
      accountNumber: this.getRequiredEnv('SEPAY_ACCOUNT_NUMBER'),
      accountName: this.configService.get<string>('SEPAY_ACCOUNT_NAME'),
    };
  }

  public verifyWebhookAuthorization(authorization?: string): boolean {
    const apiKey = this.configService.get<string>('SEPAY_API_KEY')?.trim();
    if (!apiKey) {
      return true;
    }

    return authorization?.trim() === `Apikey ${apiKey}`;
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new InternalServerErrorException(`${key} chưa được cấu hình.`);
    }

    return value;
  }
}
