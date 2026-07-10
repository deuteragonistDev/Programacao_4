//auth.service.ts
import {Injectable, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}
    async validarUsuario(username: string, senha: string): Promise<any> {
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            throw new UnauthorizedException('Usuário ou Senha Inválidos');
        }
        if (user.senha === senha ) {
            return await this.gerarToken(user);
        }
        throw new UnauthorizedException('Usuário ou Senha Inválidos');
    }

    async gerarToken(payload: User) {
        return {
            access_token: this.jwtService.sign(
                { email: payload.email },
                {
                    secret: 'topSecret512',
                    expiresIn: '50s',
                },
            ),
        };
    }
}
