import { InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateUserInput {
    @IsString()
    @IsNotEmpty({ message: 'The name is not empty' })
    @IsOptional()
    name?: string

    @IsString()
    @IsNotEmpty({ message: 'The e-mail is not empty' })
    @IsOptional()
    email?: string

    @IsString()
    @IsNotEmpty({ message: 'The password is required' })
    @IsOptional()
    password: string
}
