import { Injectable, Logger } from '@nestjs/common';

export interface QueueItem<T> {
  id: string;
  data: T;
  addedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: any;
}

@Injectable()
export class VideoProcessingQueue<T> {
  private readonly logger = new Logger(VideoProcessingQueue.name);
  private queue: QueueItem<T>[] = [];
  private processing = false;
  private maxConcurrent = 1; // Número máximo de itens processados simultaneamente
  private currentProcessing = 0;

  constructor(private processor: (item: T) => Promise<void>) {}

  // Adiciona um item à fila
  addToQueue(id: string, data: T): void {
    const queueItem: QueueItem<T> = {
      id,
      data,
      addedAt: new Date(),
      status: 'pending',
    };

    this.queue.push(queueItem);
    this.logger.log(
      `Item ${id} adicionado à fila. Total na fila: ${this.queue.length}`,
    );

    // Inicia o processamento se ainda não estiver em andamento
    if (!this.processing) {
      this.processQueue();
    }
  }

  // Processa a fila de forma assíncrona
  private async processQueue(): Promise<void> {
    this.processing = true;

    try {
      // Continua processando enquanto houver itens pendentes na fila e não exceder o limite de concorrência
      while (
        this.queue.some((item) => item.status === 'pending') &&
        this.currentProcessing < this.maxConcurrent
      ) {
        const pendingItem = this.queue.find(
          (item) => item.status === 'pending',
        );

        if (!pendingItem) {
          break;
        }

        this.currentProcessing++;
        pendingItem.status = 'processing';
        this.logger.log(
          `Processando item ${pendingItem.id}. Restantes: ${this.queue.filter((i) => i.status === 'pending').length}`,
        );

        try {
          await this.processor(pendingItem.data);
          pendingItem.status = 'completed';
          this.logger.log(
            `Processamento do item ${pendingItem.id} concluído com sucesso`,
          );
        } catch (error) {
          pendingItem.status = 'failed';
          pendingItem.error = error;
          this.logger.error(
            `Erro ao processar item ${pendingItem.id}: ${error.message}`,
          );
        } finally {
          this.currentProcessing--;
        }
      }

      // Se não há mais itens pendentes para processar e nenhum em processamento, limpa a fila
      if (
        this.queue.every((item) => item.status !== 'pending') &&
        this.currentProcessing === 0
      ) {
        // Opcionalmente, pode remover itens completos ou manter para histórico
        this.queue = this.queue.filter((item) => item.status === 'failed');
        this.processing = false;
        this.logger.log('Processamento da fila concluído');
      } else {
        // Agenda um novo ciclo de processamento
        setTimeout(() => this.processQueue(), 100);
      }
    } catch (error) {
      this.logger.error(`Erro no processamento da fila: ${error.message}`);
      this.processing = false;
      // Tentar novamente após um intervalo
      setTimeout(() => this.processQueue(), 5000);
    }
  }

  // Retorna o status atual da fila
  getQueueStatus(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    return {
      total: this.queue.length,
      pending: this.queue.filter((i) => i.status === 'pending').length,
      processing: this.queue.filter((i) => i.status === 'processing').length,
      completed: this.queue.filter((i) => i.status === 'completed').length,
      failed: this.queue.filter((i) => i.status === 'failed').length,
    };
  }

  // Retenta itens com falha
  retryFailed(): void {
    const failedItems = this.queue.filter((i) => i.status === 'failed');

    if (failedItems.length > 0) {
      failedItems.forEach((item) => {
        item.status = 'pending';
      });

      this.logger.log(
        `${failedItems.length} itens com falha foram adicionados novamente à fila`,
      );

      if (!this.processing) {
        this.processQueue();
      }
    }
  }
}
