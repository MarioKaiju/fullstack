import diagnoses from '../../data/diagnoses';

import { DiagnoseEntry } from '../types';

const getDiagnoes = (): DiagnoseEntry[] => {
  return diagnoses;
};

export default {
  getDiagnoes
};