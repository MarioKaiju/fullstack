export interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export interface exerciseInputValues {
  days: Array<number>,
  target: number
}

const parseArguments = (args: Array<string>): exerciseInputValues => {
  const values = args.splice(2, args.length - 2);

  if (values.length < 2 ) throw new Error('Not enough arguments');

  values.map((value, index) => {
    if (isNaN(Number(value))) {
      throw new Error(`Value "${value}" at index ${index} is not a number`);
    }
  });

  return  {
    target: Number(values.splice(0, 1)),
    days: values.map(value => Number(value))
  };
};

export const calculateExercises = (input: exerciseInputValues): Result => {
  const { days, target } = input;
  const periodLength = days.length;
  const trainingDays = days.reduce((previous, current) => 
  current > 0 ? previous + 1 : previous, 0);
  const average = days.reduce((previous, current) => previous + current , 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : target / average > 0.75 ? 2 : 1;

  let ratingDescription;
  switch (rating) {
    case 3 :
      ratingDescription = 'Great job!, goal archieved';
    break;
    case 2 :
      ratingDescription = 'You almost got it, work harder next time';
    break;
    case 1 :
      ratingDescription = 'You got work to do';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  console.log(calculateExercises(parseArguments(process.argv)));
} catch (e) {
  if (e instanceof Error){
    console.log('An error ocurred:', e.message);
  } else {
    console.log('Unknown error:', e);
  }
}