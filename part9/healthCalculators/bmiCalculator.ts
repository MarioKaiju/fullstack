export type BmiInputValues = {
  weight: number,
  height: number
};

type Output = string | void;

const parseInput = (args: Array<string>): BmiInputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const bmiCalculator = (input: BmiInputValues): Output => {
  const { weight, height } = input;
  if (height < 50) {
    throw new Error ('Invalid height');
  }

  const bmi = weight / Math.pow(height / 100, 2);
  
  if (bmi < 16)
    return 'Underweight (Severe thinness)';
  if (bmi >= 16 && bmi < 17)
    return 'Underweight (Moderate thinness)';
  if (bmi >= 17  && bmi < 18.5)
    return 'Underweight (Mild thinness)';
  if (bmi >= 18.5  && bmi < 25)
    return 'Normal (Healthy weight)';
  if (bmi >= 25  && bmi < 30)
    return 'Overweight (Obese)';
  if (bmi >= 30  && bmi < 35)
    return 'Obese (Class I)';
  if (bmi >= 35  && bmi < 40)
    return 'Obese (Class II)';
  if (bmi >= 40)
    return 'Obese (Class III)';
};

try {
  console.log(bmiCalculator(parseInput(process.argv)));
} catch (e) {
  if (e instanceof Error) {
    console.log("Error:", e.message);
  } else {
    console.log("Unknown error:", e);
  }
}