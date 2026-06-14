import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        throw new BadRequestException(`${metadata.data} must be a number`);
      }
      return parsedValue;
    }
    throw new BadRequestException(`${metadata.data} must be a number`);
 
  }
}
