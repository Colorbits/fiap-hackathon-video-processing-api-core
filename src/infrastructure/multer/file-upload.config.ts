import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

// Certifique-se que o diretório de destino existe
export const multerConfig = {
  dest: './files',
};

// Função de ajuda para garantir que o diretório existe
export const multerOptionsFactory = () => {
  if (!existsSync(multerConfig.dest)) {
    mkdirSync(multerConfig.dest, { recursive: true });
  }

  return {
    // Limite de 100MB para upload de vídeos
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
    // Filtro para permitir apenas arquivos mp4
    fileFilter: (req: any, file: any, callback: any) => {
      if (!file.originalname.match(/\.(mp4)$/)) {
        return callback(
          new HttpException(
            'Apenas arquivos MP4 são permitidos!',
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
      callback(null, true);
    },
    storage: diskStorage({
      destination: (req: any, file: any, callback: any) => {
        callback(null, multerConfig.dest);
      },
      filename: (req: any, file: any, callback: any) => {
        const fileName = `${uuid()}${extname(file.originalname)}`;
        callback(null, fileName);
      },
    }),
  };
};
