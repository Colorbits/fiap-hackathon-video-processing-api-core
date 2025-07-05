import axios from 'axios';
import {
  NotificationDto,
  INotificationHttpService,
} from './INotificationHttpService';
import { Logger } from '@nestjs/common';

const notificationMicroserviceEndpoint = `${process.env.NOTIFICATION_SERVICE_URL}/notifications`;

const providerName = 'INotificationHttpService';

export class NotificationHttpService implements INotificationHttpService {
  private readonly logger = new Logger(NotificationHttpService.name);

  static get providerName(): string {
    return providerName;
  }

  async createNotification(
    notificationDto: NotificationDto,
  ): Promise<NotificationDto> {
    this.logger.log(
      `createNotification ${notificationMicroserviceEndpoint} ${JSON.stringify(notificationDto)}`,
    );
    try {
      this.logger.log(
        'Enviando notificationDto para o microserviço de notificação',
      );
      const response = await axios.post<NotificationDto>(
        `${notificationMicroserviceEndpoint}/`,
        notificationDto,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Erro ao enviar notificationDto: ${error.message} ${JSON.stringify(error)}`,
        error,
      );
      throw error;
    }
  }

  async getAllNotifications(): Promise<NotificationDto[]> {
    try {
      this.logger.log('Obtendo todas as notificações');
      const response = await axios.get<NotificationDto[]>(
        `${notificationMicroserviceEndpoint}/`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao obter notificações: ${error.message}`, error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: string): Promise<NotificationDto[]> {
    try {
      this.logger.log(`Obtendo notificações para o usuário ${userId}`);
      const response = await axios.get<NotificationDto[]>(
        `${notificationMicroserviceEndpoint}/${userId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Erro ao obter notificações por usuário: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async getNotificationsByVideoUuid(
    videoUuid: string,
  ): Promise<NotificationDto[]> {
    try {
      this.logger.log(`Obtendo notificações para o vídeo ${videoUuid}`);
      const response = await axios.get<NotificationDto[]>(
        `${notificationMicroserviceEndpoint}/video/${videoUuid}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Erro ao obter notificações por vídeo: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async updateNotificationStatus(
    id: string,
    status: 'PENDING' | 'SENT' | 'FAILED',
  ): Promise<NotificationDto> {
    try {
      this.logger.log(`Atualizando status da notificação ${id} para ${status}`);
      const response = await axios.patch<NotificationDto>(
        `${notificationMicroserviceEndpoint}/${id}/status`,
        { status },
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar status da notificação: ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
