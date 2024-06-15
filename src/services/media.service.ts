import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { MediaDocument } from '@/interfaces/media.interface';
import { MediaModel } from '@/models/media.model';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { CreateMediaDto } from '@/dtos/media.dto';

@Service()
export class MediaService {
  public async createMedia(mediaData: CreateMediaDto): Promise<MediaDocument> {
    const media = await MediaModel.create(mediaData);
    return media;
  }

  public async queryMedias(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<MediaDocument>> {
    const medias = await MediaModel.paginate(filter, options);
    return medias;
  }

  public async getMediaById(mediaId: string): Promise<MediaDocument> {
    const media = await MediaModel.findById(mediaId);

    if (!media || media.deleted) throw new HttpException(httpStatus.NOT_FOUND, 'Media not found');

    return media;
  }

  public async deleteMedia(mediaId: string): Promise<MediaDocument> {
    const media = await MediaModel.findById(mediaId);
    if (!media) throw new HttpException(httpStatus.NOT_FOUND, 'Media not found');

    media.deleted = true;
    await media.save();
    return media;
  }
}
