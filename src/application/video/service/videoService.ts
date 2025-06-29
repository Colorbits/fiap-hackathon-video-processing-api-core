import { exec } from 'child_process';
import { promisify } from 'util';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Video,
  VideoDto,
  videoStatusEnum,
  VideoZipDto,
  videoZipStatusEnum,
} from 'src/shared/models';
import { IService } from 'src/application/iService';
import { ImageUploadHttpService } from 'src/infrastructure/microservices/image-upload/imageUploadHttpService';
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
    @Inject('IImageUploadHttpService')
    private imageUploadHttpService: ImageUploadHttpService,
  ) { }

  async findById(uuid: string): Promise<Video> {
    const videos = await this.findVideoUseCase.find(uuid);
    return videos[0];
  }

  async getVideoDuration(videoPath: string): Promise<number> {
    let durationInSeconds = 5; // valor padrão se não conseguirmos determinar

    // Em ambientes onde ffmpeg/ffprobe estão instalados corretamente,
    if (process.env.USE_FFPROBE === 'true') {
      try {
        // Se você souber o caminho específico para o ffprobe, pode defini-lo aqui

        const command = `ffprobe -v error -show_entries format=duration -of json "${videoPath}"`;
        const response = await execPromise(command);
        const probeData = JSON.parse(response.stdout);
        durationInSeconds = Math.floor(parseFloat(probeData.format.duration));
        this.logger.log(`Duração do vídeo: ${durationInSeconds} segundos`);
        return durationInSeconds;
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
      return durationInSeconds;
    }
  }

  async getVideoFrame({
    videoPath,
    exactTime,
    frameNumber,
    fullOutputPath,
  }: {
    videoPath: string;
    exactTime: number;
    frameNumber: number;
    fullOutputPath: string;
  }): Promise<Blob> {
    try {
      // -ss posiciona no timestamp exato (em segundos)
      const ffmpegCommand = `ffmpeg -ss ${exactTime.toFixed(3)} -i "${videoPath}" -vframes 1 -q:v 2 -y "${fullOutputPath}"`;
      await execPromise(ffmpegCommand);

      this.logger.log(`Frame extraído: ${fullOutputPath}`);
      const frameBlob = fs.readFileSync(fullOutputPath);
      return new Blob([frameBlob], { type: 'image/jpeg' });
    } catch (frameErr) {
      this.logger.error(
        `Erro ao extrair frame ${frameNumber} (tempo ${exactTime.toFixed(3)}s): ${frameErr.message}`,
      );
      // Continue tentando extrair os outros frames mesmo que um falhe
    }
  }

  async checkVideoProcessorAvailability(): Promise<boolean> {
    try {
      // Primeiro, testa se o FFmpeg está instalado e disponível
      const response = await execPromise('ffmpeg -version');
      return response.stdout.includes('ffmpeg version');
    } catch (ffmpegErr) {
      this.logger.error(`FFmpeg não está disponível: ${ffmpegErr.message}`);
    }
  }

  async processVideo(videoDto: VideoDto): Promise<void> {
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

    const durationInSeconds = await this.getVideoDuration(videoDto.path);
    const framesPerSecond = 2; // usar o valor fornecido ou padrão de 1 frame por segundo;

    const isAvailable = await this.checkVideoProcessorAvailability();

    if (!isAvailable) {
      this.logger.error(
        'FFmpeg não está instalado ou não está disponível no PATH do sistema',
      );
      return;
    }

    // Calcular o número total de frames a serem extraídos
    const totalFrames = durationInSeconds * framesPerSecond;
    this.logger.log(
      `Iniciando extração de ${totalFrames} frames (${framesPerSecond} fps por ${durationInSeconds} segundos)...`,
    );

    // Para cada segundo do vídeo
    for (let second = 0; second < durationInSeconds; second++) {
      // Para cada frame dentro desse segundo
      for (let frameIndex = 0; frameIndex < framesPerSecond; frameIndex++) {
        // Calcular o timestamp exato em segundos (com decimais para posição dentro do segundo)
        const exactTime = second + frameIndex / framesPerSecond;

        // Gerar nomes de arquivos consistentes e ordenados
        const frameNumber = second * framesPerSecond + frameIndex;
        const outputFilename = `frame-${frameNumber.toString().padStart(6, '0')}.jpg`;
        const fullOutputPath = path.join(framesDir, outputFilename);

        const frameBlob = await this.getVideoFrame({
          videoPath: videoDto.path,
          exactTime,
          frameNumber,
          fullOutputPath,
        });

        await this.imageUploadHttpService.uploadImage(
          videoDto.uuid,
          outputFilename,
          frameBlob,
        );

        this.logger.log(
          `Frame ${frameNumber} processado e enviado: ${outputFilename}`,
        );
      }
    }

    this.logger.log(`Processamento do vídeo concluído: ${videoDto.path}`);

    // Atualizar status do vídeo para 'processado'
    videoDto.status = videoStatusEnum.DONE;
    await this.editVideoUseCase.edit(videoDto);
    await this.imageUploadHttpService.updateVideoZip({
      videoUuid: videoDto.uuid,
      status: videoZipStatusEnum.DONE,
    } as VideoZipDto);
  }

  async create(videoDto: VideoDto): Promise<Video> {
    const video = await this.createVideoUseCase.create(videoDto);
    try {
      this.logger.log('Inicia o processamento do vídeo em segundo plano.');
      const videoZipDto: VideoZipDto = {
        videoUuid: video.uuid,
      };
      await this.imageUploadHttpService.createVideoZip(videoZipDto);
      this.processVideo({ uuid: video.uuid, ...videoDto });
    } catch (error) {
      this.logger.error(`Erro ao processar vídeo: ${error.message}`);

      videoDto.status = videoStatusEnum.ERROR;
      await this.editVideoUseCase.edit(videoDto);
      await this.imageUploadHttpService.updateVideoZip({
        videoUuid: videoDto.uuid,
        status: videoZipStatusEnum.DONE,
      } as VideoZipDto);
    }

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
