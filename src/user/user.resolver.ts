import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './user.entity'
import { UserService } from './user.service'

// Resolver é o cara que vai ter as entradas e saídas da aplicação
@Resolver('User')
export class UserResolver {
    constructor(private _userService: UserService) { }

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await this._userService.findAllUsers()
        return users
    }

    @Query(() => User)
    async getUserById(@Args('id') id: string): Promise<User> {
        const user = await this._userService.findUserById(id)
        return user
    }

    @Query(() => User)
    async getUserByEmail(@Args('email') email: string): Promise<User> {
        const user = await this._userService.findUserByEmail(email)
        return user
    }

    @Mutation(() => User)
    async updateUser(
        @Args('id') id: string,
        @Args('data') data: UpdateUserInput
    ): Promise<User> {
        const user = await this._userService.updateUser(id, data)
        return user
    }

    @Mutation(() => User)
    async createUser(@Args('data') data: CreateUserInput): Promise<User> {
        const user = await this._userService.createUser(data)
        return user
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: string): Promise<boolean> {
        const deleted = await this._userService.deleteUser(id)
        return deleted
    }
}
