import { InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateUserInput {
    @IsString()
    @IsNotEmpty({ message: 'The name is not empty' })
    name: string

    @IsString()
    @IsNotEmpty({ message: 'The e-mail is not empty' })
    email: string
}
