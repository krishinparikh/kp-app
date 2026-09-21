import { Test, TestingModule } from '@nestjs/testing'
import { user, type User } from '@kp-app/contract'

import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

// Wiring only — the service talks to a real database in test/users.e2e-spec.ts.
describe('UsersController', () => {
  let controller: UsersController
  const service = {
    list: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }

  const ada: User = {
    id: '0b5d2f4a-3c1e-4a7b-9f2d-8e6c1a0b4d3f',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    dob: '1815-12-10',
  }

  beforeEach(async () => {
    vi.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile()

    controller = module.get(UsersController)
  })

  it('returns users matching the contract', async () => {
    service.list.mockResolvedValue([ada])
    expect(user.array().parse(await controller.list())).toEqual([ada])
  })

  it('passes the id straight through on find', async () => {
    service.find.mockResolvedValue(ada)

    await controller.find(ada.id)

    expect(service.find).toHaveBeenCalledWith(ada.id)
  })

  it('passes the body straight through on create', async () => {
    const body = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      dob: '1815-12-10',
    }
    service.create.mockResolvedValue(ada)

    await controller.create(body)

    expect(service.create).toHaveBeenCalledWith(body)
  })

  it('passes id and body through on update', async () => {
    service.update.mockResolvedValue(ada)

    await controller.update(ada.id, { lastName: 'Byron' })

    expect(service.update).toHaveBeenCalledWith(ada.id, { lastName: 'Byron' })
  })

  it('returns the deleted user so the response has a body to parse', async () => {
    service.remove.mockResolvedValue(ada)
    expect(user.parse(await controller.remove(ada.id))).toEqual(ada)
  })
})
