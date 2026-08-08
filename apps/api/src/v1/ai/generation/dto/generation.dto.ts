import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

/** Preview element the user selected in the visual editor for this turn. */
export class SelectedElementDto {
  @IsString()
  @IsNotEmpty()
  nodeId: string = "";

  @IsString()
  @MaxLength(400)
  label: string = "";
}

export class CreateGenerationEmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  prompt: string = "";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  skills?: string[];
}

export class GenerateEmailDto {
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  prompt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  skills?: string[];
}

export class EditEmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  instruction: string = "";

  @IsOptional()
  @IsString()
  baseVariantId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  imageUrls?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SelectedElementDto)
  selectedElement?: SelectedElementDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  skills?: string[];
}
