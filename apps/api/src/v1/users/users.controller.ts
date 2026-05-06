import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiOperation({
    summary: "Update current user",
    description: "Update the authenticated user's profile information.",
  })
  async update(@UserId() userId: string, @Body() data: UpdateUserDto) {
    return await this.usersService.findByIdAndUpdate(userId, data);
  }

  @Patch("me/onboarding")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mark onboarding as complete" })
  async completeOnboarding(@UserId() userId: string) {
    return await this.usersService.completeOnboarding(userId);
  }

  @Delete()
  @ApiOperation({
    summary: "Delete current user account",
    description: "Permanently delete the authenticated user's account.",
  })
  async delete(@UserId() userId: string) {
    return await this.usersService.findByIdAndDelete(userId);
  }
}
