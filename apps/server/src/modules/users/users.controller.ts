import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  createUserBody,
  updateUserBody,
  userIdParam,
  usersResource,
  type CreateUser,
  type UpdateUser,
  type User,
} from '@kp-app/contract'

import { UsersService } from './users.service.js'

// Every `schema` below is validated by the global StandardSchemaValidationPipe
// in app.module.ts. The TypeScript annotation beside each one must be that
// schema's z.infer — NestJS doesn't cross-check them.
@Controller(usersResource)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(): Promise<User[]> {
    return this.users.list()
  }

  @Get(':id')
  find(@Param('id', { schema: userIdParam }) id: string): Promise<User> {
    return this.users.find(id)
  }

  @Post()
  create(@Body({ schema: createUserBody }) body: CreateUser): Promise<User> {
    return this.users.create(body)
  }

  @Patch(':id')
  update(
    @Param('id', { schema: userIdParam }) id: string,
    @Body({ schema: updateUserBody }) body: UpdateUser,
  ): Promise<User> {
    return this.users.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id', { schema: userIdParam }) id: string): Promise<User> {
    return this.users.remove(id)
  }
}
