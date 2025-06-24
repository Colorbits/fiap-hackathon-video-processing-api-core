import { exec } from 'child_process';
import { promisify } from 'util';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Video, VideoDto } from 'src/shared/models';
import { IService } from 'src/application/iService';
import { FindVideoUseCase } from '../useCases/findVideoUsecase';
import { FindAllVideoUseCase } from '../useCases/findAllVideoUsecase';
import { CreateVideoUseCase } from '../useCases/createVideoUsecase';
import { EditVideoUseCase } from '../useCases/editVideoUsecase';
import { DeleteVideoUseCase } from '../useCases/deleteVideoUsecase';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

@Injectable()
export class VideoService implements IService<Video> {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    @Inject('FindVideoUseCase')
    private findVideoUseCase: FindVideoUseCase,
    @Inject('FindAllVideoUseCase')
    private findAllVideoUseCase: FindAllVideoUseCase,
    @Inject('CreateVideoUseCase')
    private createVideoUseCase: CreateVideoUseCase,
    @Inject('EditVideoUseCase')
    private editVideoUseCase: EditVideoUseCase,
    @Inject('DeleteVideoUseCase')
    private deleteVideoUseCase: DeleteVideoUseCase,
  ) { }

  async findById(uuid: string): Promise<Video> {
    const videos = await this.findVideoUseCase.find(uuid);
    return videos[0];
  }

  async processVideo(videoDto: VideoDto): Promise<void> {
    try {
      this.logger.log(`Iniciando processamento do vídeo: ${videoDto.path}`);

      // Criar diretório para salvar os frames, se não existir
      const videoFileName = path.basename(
        videoDto.path,
        path.extname(videoDto.path),
      );
      const framesDir = path.join(
        process.cwd(),
        'files',
        'images',
        videoFileName,
      );

      if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir, { recursive: true });
      }

      // Definir duração padrão para o processamento
      let durationInSeconds = 60; // valor padrão se não conseguirmos determinar

      // Em ambientes onde ffmpeg/ffprobe estão instalados corretamente,
      // podemos tentar obter a duração precisa do vídeo
      if (process.env.USE_FFPROBE === 'true') {
        try {
          // Se você souber o caminho específico para o ffprobe, pode defini-lo aqui
          // Por exemplo: const ffprobePath = '/usr/local/bin/ffprobe';
          // e usar: const command = `${ffprobePath} -v error...`
          const command = `ffprobe -v error -show_entries format=duration -of json "${videoDto.path}"`;
          const { stdout } = await execPromise(command);
          const probeData = JSON.parse(stdout);
          durationInSeconds = Math.floor(parseFloat(probeData.format.duration));
          this.logger.log(`Duração do vídeo: ${durationInSeconds} segundos`);
        } catch (probeError) {
          this.logger.warn(
            `Não foi possível determinar a duração do vídeo: ${probeError.message}`,
          );
          this.logger.warn('Processando frames para os primeiros 60 segundos');
        }
      } else {
        this.logger.warn(
          'Modo de detecção de duração desativado, usando valor padrão de 60 segundos',
        );
      }

      // Verificar se o FFmpeg está disponível
      try {
        // Primeiro, testa se o FFmpeg está instalado e disponível
        await execPromise('ffmpeg -version');

        // Extrair um frame por segundo utilizando fluent-ffmpeg
        this.logger.log(`Iniciando extração de ${durationInSeconds} frames...`);

        for (let second = 0; second < durationInSeconds; second++) {
          const outputFilename = `frame-${second.toString().padStart(5, '0')}.jpg`;
          const fullOutputPath = path.join(framesDir, outputFilename);

          try {
            // Usar o comando FFmpeg diretamente via exec para mais controle
            const ffmpegCommand = `ffmpeg -ss ${second} -i "${videoDto.path}" -vframes 1 -q:v 2 -y "${fullOutputPath}"`;
            await execPromise(ffmpegCommand);
            this.logger.log(
              `Frame extraído: ${outputFilename} (${second}/${durationInSeconds})`,
            );
          } catch (frameErr) {
            this.logger.error(
              `Erro ao extrair frame ${second}: ${frameErr.message}`,
            );
            // Continue tentando extrair os outros frames mesmo que um falhe
          }
        }
      } catch (ffmpegErr) {
        this.logger.error(`FFmpeg não está disponível: ${ffmpegErr.message}`);
        throw new Error(
          'FFmpeg não está instalado ou não está disponível no PATH do sistema',
        );
      }

      this.logger.log(`Processamento do vídeo concluído: ${videoDto.path}`);

      // Atualizar status do vídeo para 'processado'
      videoDto.status = 'processed';
      await this.editVideoUseCase.edit(videoDto);
    } catch (error) {
      this.logger.error(`Erro ao processar vídeo: ${error.message}`);

      // Atualizar status do vídeo para 'error'
      videoDto.status = 'error';
      await this.editVideoUseCase.edit(videoDto);

      throw error;
    }
  }

  async create(videoDto: VideoDto): Promise<Video> {
    const video = await this.createVideoUseCase.create(videoDto);
    // Inicia o processamento do vídeo em background
    this.processVideo({ uuid: video.uuid, ...videoDto }).catch((error) => {
      this.logger.error(
        `Erro durante o processamento do vídeo: ${error.message}`,
      );
    });
    return video;
  }

  find(uuid?: string, status?: string): Promise<Video[]> {
    if (uuid || status) {
      return this.findVideoUseCase.find(uuid, status);
    }
    return this.findAllVideoUseCase.findAll();
  }

  findAll(): Promise<Video[]> {
    return this.findAllVideoUseCase.findAll();
  }

  edit(videoDto: VideoDto): Promise<Video> {
    return this.editVideoUseCase.edit(videoDto);
  }

  delete(uuid: string): Promise<void> {
    return this.deleteVideoUseCase.delete(uuid);
  }
}
