import * as dayjs from 'dayjs';
import { IAvis } from 'app/entities/avis/avis.model';
import { IEditeur } from 'app/entities/editeur/editeur.model';

export interface IJeu {
  id?: number;
  nom?: string | null;
  description?: string | null;
  dateSortie?: dayjs.Dayjs | null;
  avis?: IAvis[] | null;
  editeur?: IEditeur | null;
}

export class Jeu implements IJeu {
  constructor(
    public id?: number,
    public nom?: string | null,
    public description?: string | null,
    public dateSortie?: dayjs.Dayjs | null,
    public avis?: IAvis[] | null,
    public editeur?: IEditeur | null
  ) {}
}

export function getJeuIdentifier(jeu: IJeu): number | undefined {
  return jeu.id;
}
