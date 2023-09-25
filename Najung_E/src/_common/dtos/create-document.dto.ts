import { IsBoolean, IsNumber, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9\s~`!@#$%^&*()_+=[\]{}|\\;:'",<.>?/-]+$/)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9\s~`!@#$%^&*()_+=[\]{}|\\;:'",<.>?/-]+$/)
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isSecret: boolean;

  // memberId: number;

  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
