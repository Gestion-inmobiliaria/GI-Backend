import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './email/email.service';
import { HttpCustomService } from './http/http.service';
import { Global } from '@nestjs/common/decorators/modules/global.decorator';


@Global()
@Module({
    imports: [ HttpModule ],
    providers: [ HttpCustomService , EmailService ],
    exports: [ HttpCustomService , HttpModule, EmailService ],
})

export class ProvidersModule {}
