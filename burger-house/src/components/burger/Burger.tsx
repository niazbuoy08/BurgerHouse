import classes from './burger.module.scss';

import React from 'react';
import Ingredient from '../ingredient';
import clsx from 'clsx';
import { BurgerIngredient } from '../../server/models/burger.model';

const foodColors: Record<string, string> = {
  tomato: '#FF6347', // Tomato red
  chicken: '#D2B48C', // Tan (a light shade of brown for chicken)
  fish: '#708090', // Slate gray (for fish)
  cheese: '#FFD700', // Golden for cheese
  lettuce: '#228B22', // Forest green for lettuce
};

interface Props {
  ingredients: BurgerIngredient[];
  className?: string;
}

const Burger: React.FC<Props> = ({ ingredients, className }) => {
  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes['top-bun']}></div>
      {ingredients.map(({ display }: any, i: number) => {
        return <Ingredient key={i} height={`1.5rem`} color="#FF6347" />;
      })}
      <div className={classes['bottom-bun']}></div>
    </div>
  );
};

export default Burger;
