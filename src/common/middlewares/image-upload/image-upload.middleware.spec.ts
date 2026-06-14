import { CloudinaryUploadMiddleware } from './image-upload.middleware';
import { ConfigService } from '@nestjs/config';

describe('CloudinaryUploadMiddleware', () => {
  it('should be defined', () => {
    const configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    expect(new CloudinaryUploadMiddleware(configService)).toBeDefined();
  });
});
