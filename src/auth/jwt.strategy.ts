import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private _userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: { username: string; sub: User['id'] }) {
        const user = this._userService.findUserById(payload.sub)

        if (!user) {
            return new UnauthorizedException('Unauthorized')
        }
        return user
    }
}
