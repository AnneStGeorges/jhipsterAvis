import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJeu, Jeu } from '../jeu.model';
import { JeuService } from '../service/jeu.service';
import { IEditeur } from 'app/entities/editeur/editeur.model';
import { EditeurService } from 'app/entities/editeur/service/editeur.service';

@Component({
  selector: 'jhi-jeu-update',
  templateUrl: './jeu-update.component.html',
})
export class JeuUpdateComponent implements OnInit {
  isSaving = false;

  editeursSharedCollection: IEditeur[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    description: [],
    dateSortie: [],
    editeur: [],
  });

  constructor(
    protected jeuService: JeuService,
    protected editeurService: EditeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jeu }) => {
      if (jeu.id === undefined) {
        const today = dayjs().startOf('day');
        jeu.dateSortie = today;
      }

      this.updateForm(jeu);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jeu = this.createFromForm();
    if (jeu.id !== undefined) {
      this.subscribeToSaveResponse(this.jeuService.update(jeu));
    } else {
      this.subscribeToSaveResponse(this.jeuService.create(jeu));
    }
  }

  trackEditeurById(index: number, item: IEditeur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJeu>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(jeu: IJeu): void {
    this.editForm.patchValue({
      id: jeu.id,
      nom: jeu.nom,
      description: jeu.description,
      dateSortie: jeu.dateSortie ? jeu.dateSortie.format(DATE_TIME_FORMAT) : null,
      editeur: jeu.editeur,
    });

    this.editeursSharedCollection = this.editeurService.addEditeurToCollectionIfMissing(this.editeursSharedCollection, jeu.editeur);
  }

  protected loadRelationshipsOptions(): void {
    this.editeurService
      .query()
      .pipe(map((res: HttpResponse<IEditeur[]>) => res.body ?? []))
      .pipe(
        map((editeurs: IEditeur[]) => this.editeurService.addEditeurToCollectionIfMissing(editeurs, this.editForm.get('editeur')!.value))
      )
      .subscribe((editeurs: IEditeur[]) => (this.editeursSharedCollection = editeurs));
  }

  protected createFromForm(): IJeu {
    return {
      ...new Jeu(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateSortie: this.editForm.get(['dateSortie'])!.value ? dayjs(this.editForm.get(['dateSortie'])!.value, DATE_TIME_FORMAT) : undefined,
      editeur: this.editForm.get(['editeur'])!.value,
    };
  }
}
