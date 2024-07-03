import { IsNumber, IsInt, IsPositive, Min, MinLength, IsOptional } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsInt()
    @IsNumber()
    @IsPositive()
    offset?: number;
}