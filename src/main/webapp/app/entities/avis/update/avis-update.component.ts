import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAvis, Avis } from '../avis.model';
import { AvisService } from '../service/avis.service';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';
import { IJeu } from 'app/entities/jeu/jeu.model';
import { JeuService } from 'app/entities/jeu/service/jeu.service';

@Component({
  selector: 'jhi-avis-update',
  templateUrl: './avis-update.component.html',
})
export class AvisUpdateComponent implements OnInit {
  isSaving = false;

  joueursSharedCollection: IJoueur[] = [];
  jeusSharedCollection: IJeu[] = [];

  editForm = this.fb.group({
    id: [],
    note: [],
    description: [],
    dateEnvoi: [],
    joueur: [],
    jeu: [],
  });

  constructor(
    protected avisService: AvisService,
    protected joueurService: JoueurService,
    protected jeuService: JeuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avis }) => {
      if (avis.id === undefined) {
        const today = dayjs().startOf('day');
        avis.dateEnvoi = today;
      }

      this.updateForm(avis);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const avis = this.createFromForm();
    if (avis.id !== undefined) {
      this.subscribeToSaveResponse(this.avisService.update(avis));
    } else {
      this.subscribeToSaveResponse(this.avisService.create(avis));
    }
  }

  trackJoueurById(index: number, item: IJoueur): number {
    return item.id!;
  }

  trackJeuById(index: number, item: IJeu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvis>>): void {
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

  protected updateForm(avis: IAvis): void {
    this.editForm.patchValue({
      id: avis.id,
      note: avis.note,
      description: avis.description,
      dateEnvoi: avis.dateEnvoi ? avis.dateEnvoi.format(DATE_TIME_FORMAT) : null,
      joueur: avis.joueur,
      jeu: avis.jeu,
    });

    this.joueursSharedCollection = this.joueurService.addJoueurToCollectionIfMissing(this.joueursSharedCollection, avis.joueur);
    this.jeusSharedCollection = this.jeuService.addJeuToCollectionIfMissing(this.jeusSharedCollection, avis.jeu);
  }

  protected loadRelationshipsOptions(): void {
    this.joueurService
      .query()
      .pipe(map((res: HttpResponse<IJoueur[]>) => res.body ?? []))
      .pipe(map((joueurs: IJoueur[]) => this.joueurService.addJoueurToCollectionIfMissing(joueurs, this.editForm.get('joueur')!.value)))
      .subscribe((joueurs: IJoueur[]) => (this.joueursSharedCollection = joueurs));

    this.jeuService
      .query()
      .pipe(map((res: HttpResponse<IJeu[]>) => res.body ?? []))
      .pipe(map((jeus: IJeu[]) => this.jeuService.addJeuToCollectionIfMissing(jeus, this.editForm.get('jeu')!.value)))
      .subscribe((jeus: IJeu[]) => (this.jeusSharedCollection = jeus));
  }

  protected createFromForm(): IAvis {
    return {
      ...new Avis(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateEnvoi: this.editForm.get(['dateEnvoi'])!.value ? dayjs(this.editForm.get(['dateEnvoi'])!.value, DATE_TIME_FORMAT) : undefined,
      joueur: this.editForm.get(['joueur'])!.value,
      jeu: this.editForm.get(['jeu'])!.value,
    };
  }
}
