import express from 'express';
import { bmiCalculator, BmiInputValues } from './bmiCalculator';
import { exerciseInputValues, calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

interface Body {
  days: Array<number>,
  target: number
}

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const input: BmiInputValues = {
      height: Number(height), weight: Number(weight)
    };

    try {
      const bmi = bmiCalculator(input);
      res.json({ height, weight, bmi });
    } catch (e) {
      if (e instanceof Error) {
        res.json({ error : e.message });
      } else {
        console.log('Unexpected error', e);
      }
    }
  }
  else
    res.json({ error: "malformatted parameters" });
});

app.post('/exercise', (req, res) => {
  const body = req.body as Body;
  const { days, target } = body;

  if (days && target) { 
    days.map((value: string | number, index: number) => {
      if (isNaN(Number(value))) {
        res.status(400).json({ error: `Value '${value}' at index ${index} is not a number` });
      }
    });

    if (isNaN(Number(target))) {
      res.status(400).json({ error: 'Target must be a number' });
    }

    const input : exerciseInputValues = { days, target };
    const result = calculateExercises(input);
    res.json(result);
  } else {
    res.status(400).send({ error: "parameters missing" });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});