import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string

  @IsString()
  @MinLength(1)
  content!: string

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}
