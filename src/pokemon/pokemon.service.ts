import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(search: string) {
    let pokemon: Pokemon;


    if (!isNaN(+search)) {
      pokemon = await this.pokemonModel.findOne({ no: search })
    }

    if (isValidObjectId(search)) {
      pokemon = await this.pokemonModel.findById(search)
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: search.toLocaleLowerCase().trim()
      })
    }


    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no ${search} not found`)

    }


    return pokemon
  }

  async update(search: string, updatePokemonDto: UpdatePokemonDto) {
    try {

      const pokemon = await this.findOne(search);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      }

      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }

    return 'Pokemon delete exists'

  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException("Can't create Pokemon - Check server logs")

  }
}
