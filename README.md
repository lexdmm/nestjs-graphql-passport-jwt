<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Using JWT - Json Web Token with Typescript NestJS.

## Prerequisites to run

Have installed the following
- Docker https://docs.docker.com/get-docker/
- VSCode https://code.visualstudio.com/download

For WSL2 to use https://docs.docker.com/engine/install/ubuntu/ other distros in same page.

## Installation
If you to change some code in project, use the param *--buid* to the rebuild container with your changes
```bash
$ docker-compose up --build
```

## Running the app without docker (need postgres installed)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Put in your browser
http://localhost:3000/graphql

## NestJS + JWT
The Token is divided into three parts. Every part of it can be seen here https://jwt.io/. In the documentation each part is separated by color for ease of understanding.

For implementation with NestJS, check the documentation: https://docs.nestjs.com/security/authentication
All these developments were based on her.

As I used the JWT, it was not necessary to install the lib **passport-local** as shown in the NestJS documentation, I just used the **passport** dependency.
```bash
$ npm install --save @nestjs/passport passport
```

NestJS documentation using JWT can be seen here https://docs.nestjs.com/security/authentication#jwt-functionality
In this case, use the dependencies: 
```bash
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt -D
```

In the documentation we see the use of a secret key in the *auth.module.ts* using the **JwtModule.register** method:
```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

But it is not recommended to leave sensitive information like this code. Ideally, use the **JwtModule.registerAsync** method as shown in https://github.com/nestjs/jwt. And put the secret key in the **.env**. There, I created the constant JWT_SECRET
```typescript
JwtModule.registerAsync({
  useFactory: () => ({
    secret: process.env.JWT_SECRET
  })
})
```

Use the token that returns from the mutation "login" in graphql.
```javascript
mutation{
  login (
    data: {
    	email:"joca@teste.com"
      password: "124356"
    }
  ),
  {
    user {
      id
      name
      email
    }
    token
  }
}
```

Paste it into the encoded frame of ![JWT.io](https://jwt.io/) to see what each part of the token looks like. 