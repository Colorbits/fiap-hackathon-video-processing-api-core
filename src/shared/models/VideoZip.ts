export enum videoZipStatusEnum {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface VideoZipDto {
  uuid?: string;
  videoUuid: string;
  status?: videoZipStatusEnum;
  path?: string;
}
