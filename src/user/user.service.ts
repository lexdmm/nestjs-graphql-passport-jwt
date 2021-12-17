import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) //Ta dizendo que o papel de criar a instancia é do repositório
        private _userRepository: Repository<User>
    ) {}

    async findAllUsers(): Promise<User[]> {
        const users = await this._userRepository.find()
        return users
    }

    async findUserById(id: string): Promise<User> {
        const user = await this._userRepository.findOne(id)
        if (!user) {
            throw new InternalServerErrorException('User not found')
        }
        return user
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this._userRepository.findOne({ where: { email } })
        if (!user) {
            throw new InternalServerErrorException('User not found')
        }
        return user
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<User> {
        const user = await this.findUserById(id)
        await this._userRepository.update(user, { ...data })

        const userUpdated = this._userRepository.create({ ...user, ...data })
        return userUpdated
    }

    async createUser(data: CreateUserInput): Promise<User> {
        const user = this._userRepository.create(data)
        const userSaved = await this._userRepository.save(user)

        if (!userSaved) {
            throw new InternalServerErrorException(
                'There was an error creating the user'
            )
        }
        return userSaved
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.findUserById(id)
        const deleted = await this._userRepository.delete(user)

        if (deleted) {
            return true
        }
        return false
    }
}
