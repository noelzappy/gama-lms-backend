import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { MediaController } from '@/controllers/media.controller';

import { AuthMiddleware } from '@/middlewares/auth.middleware';
import UploadMiddleware from '@/middlewares/upload.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { PaginatedMediaQueryParam } from '@/dtos/media.dto';

export class MediaRoute implements Routes {
  public router = Router();
  public media = new MediaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/media', AuthMiddleware('manageMedia'), UploadMiddleware.single('file'), this.media.createMedia);
    this.router.get('/media', ValidationMiddleware(PaginatedMediaQueryParam, 'query', true), this.media.queryMedias);
    this.router.get('/media/:id', this.media.getMediaById);
    this.router.delete('/media/:id', this.media.deleteMedia);
  }
}
