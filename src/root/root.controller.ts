import { Controller, Get } from '@nestjs/common';
import { readFile } from 'mz/fs';

@Controller('/')
export class RootController {
  @Get()
  async root() {
    const packageString = await readFile('./package.json');
    const packageJson = JSON.parse(packageString.toString('utf-8'));
    return { version: packageJson.version };
  }
}
