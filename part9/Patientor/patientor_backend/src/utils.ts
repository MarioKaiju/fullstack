import { Gender, newPatientEntry } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (value: unknown, fieldName: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect or mising ${fieldName}`);
  }

  return value;
};

const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
  if(!gender || !isGender(gender)) {
    throw new Error('Incorrect or mising gender: ' + gender);
  }
  return gender;
};

const toNewPatientEntry = (object: any): newPatientEntry => {
  const newEntry: newPatientEntry = {
    name: parseString(object.name, 'name'),
    dateOfBirth: parseString(object.dateOfBirth, 'date of birth'),
    ssn: parseString(object.ssn, 'ssn'),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation, 'occupation')
  };

  return newEntry;
};

export default toNewPatientEntry;