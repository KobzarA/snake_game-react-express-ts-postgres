import { Food } from '../store/gameSlice';

export const clearBoard = (
  context: CanvasRenderingContext2D | null,
  width: number,
  height: number
) => {
  if (context) {
    context.clearRect(0, 0, width, height);
  }
};

export interface IObjectBody {
  x: number;
  y: number;
}

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  strokeStyle = '#146356'
) => {
  if (context) {
    objectBody.forEach((object: IObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context?.fillRect(object.x, object.y, 20, 20);
      context?.strokeRect(object.x, object.y, 20, 20);
    });
  }
};

function randomNumber(max: number) {
  const random = Math.random() * max;
  return random - (random % 20);
}

function randomFoodValue(): 1 | 5 | 10 {
  const values = [1, 5, 10];
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as 1 | 5 | 10;
}

export const generateRandomPosition = (
  width: number = 980,
  height: number = 580
): Food => {
  return {
    pos: {
      x: randomNumber(width),
      y: randomNumber(height),
    },
    value: randomFoodValue(),
  };
};
