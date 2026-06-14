import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AddressParserPipe implements PipeTransform {
  transform(value: any) {
    if (
      value?.address &&
      typeof value.address === 'string'
    ) {
      try {
        value.address = JSON.parse(value.address);
      } catch {
        throw new BadRequestException(
          'Invalid address JSON format',
        );
      }
    }

    return value;
  }
}
