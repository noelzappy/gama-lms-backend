import { Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser, RequestWithUserAndFile } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import pick from '@/utils/pick';
import { MediaService } from '@/services/media.service';
import { CreateMediaDto } from '@/dtos/media.dto';

export class MediaController {
  public media = Container.get(MediaService);

  public createMedia = catchAsync(async (req: RequestWithUserAndFile, res: Response) => {
    if (!req.file) {
      res.status(httpStatus.BAD_REQUEST).json({ message: 'File is required' });
      return;
    }

    const mediaData: CreateMediaDto = {
      createdBy: req.user.id,
      url: req.file.location,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      bucket: req.file.bucket,
      key: req.file.key,
    };

    const newMedia = await this.media.createMedia(mediaData);
    res.status(httpStatus.CREATED).json(newMedia);
  });

  public queryMedias = catchAsync(async (req: RequestWithUser, res: Response) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    filter.deleted = false;

    const medias = await this.media.queryMedias(filter, options);

    res.status(httpStatus.OK).json(medias);
  });

  public getMediaById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const mediaId: string = req.params.id;

    const media = await this.media.getMediaById(mediaId);

    res.status(httpStatus.OK).json(media);
  });

  public deleteMedia = catchAsync(async (req: RequestWithUser, res: Response) => {
    const mediaId: string = req.params.id;

    const media = await this.media.deleteMedia(mediaId);

    res.status(httpStatus.OK).json(media);
  });
}
