
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
    url: string;
    secureUrl: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    resourceType: string;
    originalName: string;
    mimetype: string;
}

const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
) => {
    if (!allowedMimes.includes(file.mimetype)) {
        return callback(
            new BadRequestException(
                'Only image files are allowed (jpeg, png, gif, webp)',
            ),
        );
    }
    callback(null, true);
};

const multerOptions: multer.Options = {
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};

const uploadSingle = multer(multerOptions).single('file');
const uploadMultiple = multer(multerOptions).array('files', 10);

const uploadBufferToCloudinary = (
    buffer: Buffer,
    folder: string,
): Promise<CloudinaryUploadResult & { originalName?: string; mimetype?: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(new BadRequestException(error.message));
                if (!result) return reject(new BadRequestException('Cloudinary upload failed'));

                resolve({
                    url: result.url,
                    secureUrl: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                    resourceType: result.resource_type,
                    originalName: '',
                    mimetype: '',
                });
            },
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};

@Injectable()
export class CloudinaryUploadMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const folder = this.configService.get<string>('CLOUDINARY_FOLDER') ?? 'uploads';

        const isMultipleRoute =
            req.path.includes('gallery') ||
                req.path.includes('images') ||
                req.path.includes('multi');

        if (isMultipleRoute) {
            uploadMultiple(req, res, async (err: any) => {
                if (err) return next(new BadRequestException(err.message));

                const files = req.files as Express.Multer.File[];
                if (!files || files.length === 0) return next();

                try {
                    const uploaded = await Promise.all(
                        files.map(async (file) => {
                            const result = await uploadBufferToCloudinary(file.buffer, folder);
                            return { ...result, originalName: file.originalname, mimetype: file.mimetype };
                        }),
                    );

                    // Attach to req for use in controllers
                    (req as any).cloudinaryFiles = uploaded;
                    next();
                } catch (uploadErr: any) {
                    next(new BadRequestException(uploadErr.message));
                }
            });
        } else {
            uploadSingle(req, res, async (err: any) => {
                if (err) return next(new BadRequestException(err.message));

                const file = req.file;
                if (!file) return next();

                try {
                    const result = await uploadBufferToCloudinary(file.buffer, folder);

                    (req as any).cloudinaryFile = {
                        ...result,
                        originalName: file.originalname,
                        mimetype: file.mimetype,
                    };
                    next();
                } catch (uploadErr: any) {
                    next(new BadRequestException(uploadErr.message));
                }
            });
        }
    }
}
