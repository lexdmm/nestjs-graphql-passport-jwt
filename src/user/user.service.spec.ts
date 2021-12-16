import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'

describe('UserService', () => {
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService]
        }).compile()

        module.get<UserService>(UserService)
    })
})
