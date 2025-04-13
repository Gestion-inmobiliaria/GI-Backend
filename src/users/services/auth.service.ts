import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { IPayload } from '../interfaces/payload.interface';
import { IGenerateToken } from '../interfaces/generate-token.interface';
import { IUserToken } from '../interfaces/userToken.interface';
import { userToken } from '../utils/user-token.utils';
import { handlerError } from 'src/common/utils/handlerError.utils';



@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    public async login(email: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findOneBy({
                key: 'email',
                value: email,
            });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!user || !isPasswordValid || !user.isActive)
                throw new NotFoundException('Usuario o contraseña incorrectos');
            return this.generateJWT(user);
        } catch (error) {
          handlerError(error, this.logger);
        }
    }

    public async checkToken(token: string): Promise<UserEntity> {
        try {
            const managerToken: IUserToken | string = userToken(token);
            if (typeof managerToken === 'string')
                throw new NotFoundException('Token invalido');
            if (managerToken.isExpired) throw new NotFoundException('Token expirado');
            const user = await this.userService.findOneAuth(managerToken.sub);
            return user;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async generateJWT(user: UserEntity): Promise<any> {
        const userLogged: UserEntity = await this.userService.findOne(user.id);
        const payload: IPayload = {
            sub: userLogged.id,
            role: userLogged.role.id,      
        };
        const accessToken = this.singJWT({
            payload,
            secret: this.configService.get('JWT_AUTH'),
            expiresIn: 28800,
        });
        return {
            accessToken,
            User: userLogged,
        };
    }

    public async handleGoogleUser(profile: any): Promise<UserEntity> {
        const { email } = profile;
        const user = await this.userService.findOneBy({ key: 'email', value: email });
        if (!user) {
            throw new NotFoundException('Usuario no registrado en el sistema');
        }
        return user;
    }

    public singJWT({ payload, secret, expiresIn }: IGenerateToken) {
        const options: jwt.SignOptions = { expiresIn: expiresIn as any };  // Fuerza a un tipo compatible
        return jwt.sign(payload, secret, options );
    }
}
