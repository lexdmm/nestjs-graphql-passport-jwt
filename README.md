<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Using JWT - Json Web Token with Typescript NestJS and GraphQL.
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

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

Put in your browser: http://localhost:3000/graphql

### NestJS + JWT
The Token is divided into three parts. Every part of it can be seen here https://jwt.io/. In the documentation each part is separated by color for ease of understanding.

For implementation with NestJS, check the documentation: [NestJS Authentication](https://docs.nestjs.com/security/authentication)
All these developments were based on her.

As I used the JWT, it was not necessary to install the lib **passport-local** as shown in the NestJS documentation, I just used the **passport** dependency.
```bash
$ npm install --save @nestjs/passport passport
```

NestJS documentation using JWT can be seen here [GraphQL Authentication JWT-functionality](https://docs.nestjs.com/security/authentication#jwt-functionality)
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

Use the token that returns from the mutation "login" in graphql, field token.
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

In https://jwt.io/, paste it into the encoded frame to see what each part of the token looks like. 

Note that an Invalid Signature will occur.
![Captura de tela 2021-12-17 110244](https://user-images.githubusercontent.com/66276069/146563967-8503dfa0-cacf-4cf7-9584-bddf00e99b0e.png)

This happens because it is missing the key that was configured in the JWT_SECRET from **.env** file
Just inform as in the example below, into verify signature.

![Captura de tela 2021-12-17 110343](https://user-images.githubusercontent.com/66276069/146564133-8a2f3f47-d1a8-4355-a4f8-9bb88b8deff6.png)

###Guards

Then create guards to protect the routes.
Guards are like route protectors, so only users who are logged into the application will be able to access them, because the routes will not be open.

As GraphQL is used, to implement it has to follow the recommendations informed in the documentation in the **GraphQL** topic, just as it is in the code.
[GraphQL Authentication JWT-functionality](https://docs.nestjs.com/security/authentication#jwt-functionality)

Decorator @UseGuards allows the route to be accessible with authentication.
See the example at **user.resolver.ts**

```typescript
@UseGuards(GqlAuthGuard)
@Query(() => User)
async getUserById(@Args('id') id: string): Promise<User> {
	const user = await this._userService.findUserById(id)
	return user
}
```

Running the login route in graphQL and copy the token.
![Captura de tela 2021-12-17 160939](https://user-images.githubusercontent.com/66276069/146597942-d13c2e51-1fbc-4b2e-bbe7-75701f899c5e.png)

Put the token in the graphQL playgroud **HTTP Header** tab, as the authentication is bearer type, do as below and paste the token after Bearer into some route.
```typescript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkrDs2NhIEJhY2FuaW5oYSIsInN1YiI6IjViODM0NTZjLWU1NzUtNGI4NC04ZGY2LThhYjdkNGUyMzk2MCIsImlhdCI6MTYzOTc2ODA5NywiZXhwIjoxNjM5NzY4MjE3fQ.5uN4wjOMbtbAHYlicE3_DySQtlhImCc4gFQzUfWnq4I"
}
```

Example
![Captura de tela 2021-12-17 163516](https://user-images.githubusercontent.com/66276069/146598511-fa36067e-e4c4-449c-8e76-60397cf4f34d.png)


Here in the example the token expires every two minutes, to change it, do it in auth.module.ts and change the time
```typescript
expiresIn: '120s'
```
