import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";
import { SchemaFactory } from "@nestjs/mongoose/dist/factories";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}


export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
