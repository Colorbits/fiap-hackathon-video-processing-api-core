import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IService } from '../../application/iService';
import { Video, VideoDto } from '../../shared/models';
import { extname } from 'path';
import { diskStorage } from 'multer';

const destination = '/files/videos';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4)$/)) {
    return callback(
      new HttpException(
        'Somente arquivos de video .mp4 são permitidos!',
        HttpStatus.FORBIDDEN,
      ),
      false,
    );
  }
  callback(null, true);
};

@ApiTags('Vídeos')
@Controller('videos')
export class VideoApi {
  private readonly logger = new Logger(VideoApi.name);

  constructor(
    @Inject('IService<Video>') private videoService: IService<Video>,
  ) { }

  @ApiOperation({
    summary: 'Obter todos os vídeos',
    description: 'Retorna uma lista de todos os vídeos disponíveis no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vídeos retornada com sucesso.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao buscar vídeos.' })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    description: 'Filtrar vídeos por status',
  })
  @Get()
  findAll(@Query('status') status?: string): Promise<Video[]> {
    return status
      ? this.videoService.find(undefined, status)
      : this.videoService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar vídeos por filtro',
    description: 'Busca um vídeo específico com base no ID ou status do vídeo.',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'ID do vídeo a ser buscado',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    description: 'Status do vídeo a ser buscado',
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo(s) encontrado(s) com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar o vídeo.' })
  @Get(':uuid')
  find(
    @Param('uuid') uuid: string,
    @Query('status') status?: string,
  ): Promise<Video[]> {
    return this.videoService.find(uuid, status);
  }

  @ApiOperation({
    summary: 'Criar um novo vídeo',
    description: 'Envia um arquivo de vídeo .mp4 para processamento.',
  })
  @ApiResponse({ status: 201, description: 'Vídeo criado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para criação do vídeo.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao criar o vídeo.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'ID do usuário que está enviando o vídeo',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de vídeo no formato .mp4',
        },
      },
    },
  })
  @Post(':userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `.${destination}`,
        filename: editFileName,
      }),
      fileFilter: videoFileFilter,
    }),
  )
  async create(
    @Param('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Video> {
    if (!file) {
      throw new HttpException(
        'Arquivo de vídeo não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cria o objeto VideoDto com as informações do arquivo
    const videoDto: VideoDto = {
      userId,
      name: file.originalname.split('.')[0],
      extension: 'mp4',
      path: file.path,
      status: 'uploaded',
    };

    const video = await this.videoService.create(videoDto);
    this.logger.debug(`Created video: ${JSON.stringify(video)}`);
    return video;
  }

  @ApiOperation({
    summary: 'Editar um vídeo existente',
    description:
      'Atualiza os dados de um vídeo específico com base no ID fornecido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para atualização do vídeo.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar o vídeo.' })
  @Put(':uuid')
  async edit(
    @Param('uuid') uuid: string,
    @Body() videoDto: VideoDto,
  ): Promise<Video> {
    const updatedVideo = await this.videoService.edit({
      ...videoDto,
      uuid,
    });
    this.logger.debug(`Updated video: ${JSON.stringify(updatedVideo)}`);
    return updatedVideo;
  }

  @ApiOperation({
    summary: 'Remover um vídeo',
    description: 'Exclui um vídeo específico com base no ID fornecido.',
  })
  @ApiResponse({ status: 204, description: 'Vídeo deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao remover o vídeo.' })
  @Delete(':id')
  async delete(@Param('uuid') uuid: number): Promise<void> {
    await this.videoService.delete(uuid);
    this.logger.debug(`Deleted video with id: ${uuid}`);
  }
}
