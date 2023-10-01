import patients from "../../data/patients";

import { newPatientEntry, NonSSNEntry, PatientEntry } from "../types";
import { v1 as uuid } from 'uuid';

const getPatients = (): PatientEntry [] => {
  return patients;
};

const getNonSSNPatientEntries = (): NonSSNEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry : newPatientEntry): PatientEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getNonSSNPatientEntries, getPatients,
  addPatient
};