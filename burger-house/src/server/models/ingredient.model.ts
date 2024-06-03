import {
  prop as Property,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { FoodType } from '../../utils/types/ingredients';

// Display class for handling visual attributes
class Display {
  @Property({ default: 1 })
  height!: number;

  @Property()
  color!: string;

  constructor(color: string = '#FFFFFF') {
    // Default to white if no color is provided
    this.color = color;
  }
}

// Mapping of food types to their corresponding display colors
const foodColors: Record<string, string> = {
  tomato: '#FF6347', // Tomato red
  chicken: '#D2B48C', // Tan (a light shade of brown for chicken)
  fish: '#708090', // Slate gray (for fish)
  cheese: '#FFD700', // Golden for cheese
  lettuce: '#228B22', // Forest green for lettuce
};

@modelOptions({
  schemaOptions: {
    toJSON: {
      versionKey: false,
      transform(_, ret) {
        // Transforming photo path
        ret.photo = `/ingredients/${ret.photo}`;
        // Assigning color based on food type using the foodColors map
        ret.display = new Display(
          foodColors[ret.name.toLowerCase()] || '#FFFFFF'
        ); // Default to white if not specified
      },
    },
  },
})
export class Ingredient {
  readonly _id!: string;

  @Property({
    trim: true,
    lowercase: true,
    required: [true, 'Ingredient must have a valid name'],
  })
  name!: string;

  @Property({ required: [true, 'Ingredient must have a valid price'] })
  price!: number;

  @Property({ enum: FoodType, default: FoodType.None })
  foodType!: string;

  @Property({ default: 'default.jpg' })
  photo!: string;

  @Property({ _id: false, default: () => new Display() })
  display!: Display;
}

// Exporting the model
const IngredientModel = (mongoose.models.Ingredient ||
  getModelForClass(Ingredient)) as ReturnModelType<typeof Ingredient, {}>;

export default IngredientModel;
