import { Injectable, UnauthorizedException } from '@nestjs/common'
import { compareSync } from 'bcrypt'
import { UserService } from '../user/user.service'
import { AuthInput } from './dto/auth.input'
import { AuthType } from './dto/auth.type'

@Injectable()
export class AuthService {
    constructor(private _userService: UserService) {}

    async validateUser(data: AuthInput): Promise<AuthType> {
        const user = await this._userService.findUserByEmail(data.email)
        const validPassword = compareSync(data.password, user.password)

        if (!validPassword) {
            throw new UnauthorizedException('Incorect Password')
        }

        return {
            user,
            token: 'token'
        }
    }
}
