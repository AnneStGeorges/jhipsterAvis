jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AvisService } from '../service/avis.service';
import { IAvis, Avis } from '../avis.model';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';
import { IJeu } from 'app/entities/jeu/jeu.model';
import { JeuService } from 'app/entities/jeu/service/jeu.service';

import { AvisUpdateComponent } from './avis-update.component';

describe('Component Tests', () => {
  describe('Avis Management Update Component', () => {
    let comp: AvisUpdateComponent;
    let fixture: ComponentFixture<AvisUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let avisService: AvisService;
    let joueurService: JoueurService;
    let jeuService: JeuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AvisUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AvisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AvisUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      avisService = TestBed.inject(AvisService);
      joueurService = TestBed.inject(JoueurService);
      jeuService = TestBed.inject(JeuService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Joueur query and add missing value', () => {
        const avis: IAvis = { id: 456 };
        const joueur: IJoueur = { id: 88765 };
        avis.joueur = joueur;

        const joueurCollection: IJoueur[] = [{ id: 29466 }];
        spyOn(joueurService, 'query').and.returnValue(of(new HttpResponse({ body: joueurCollection })));
        const additionalJoueurs = [joueur];
        const expectedCollection: IJoueur[] = [...additionalJoueurs, ...joueurCollection];
        spyOn(joueurService, 'addJoueurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        expect(joueurService.query).toHaveBeenCalled();
        expect(joueurService.addJoueurToCollectionIfMissing).toHaveBeenCalledWith(joueurCollection, ...additionalJoueurs);
        expect(comp.joueursSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Jeu query and add missing value', () => {
        const avis: IAvis = { id: 456 };
        const jeu: IJeu = { id: 73746 };
        avis.jeu = jeu;

        const jeuCollection: IJeu[] = [{ id: 6220 }];
        spyOn(jeuService, 'query').and.returnValue(of(new HttpResponse({ body: jeuCollection })));
        const additionalJeus = [jeu];
        const expectedCollection: IJeu[] = [...additionalJeus, ...jeuCollection];
        spyOn(jeuService, 'addJeuToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        expect(jeuService.query).toHaveBeenCalled();
        expect(jeuService.addJeuToCollectionIfMissing).toHaveBeenCalledWith(jeuCollection, ...additionalJeus);
        expect(comp.jeusSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const avis: IAvis = { id: 456 };
        const joueur: IJoueur = { id: 59861 };
        avis.joueur = joueur;
        const jeu: IJeu = { id: 4146 };
        avis.jeu = jeu;

        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(avis));
        expect(comp.joueursSharedCollection).toContain(joueur);
        expect(comp.jeusSharedCollection).toContain(jeu);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = { id: 123 };
        spyOn(avisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avis }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(avisService.update).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = new Avis();
        spyOn(avisService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avis }));
        saveSubject.complete();

        // THEN
        expect(avisService.create).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = { id: 123 };
        spyOn(avisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(avisService.update).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJoueurById', () => {
        it('Should return tracked Joueur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJoueurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackJeuById', () => {
        it('Should return tracked Jeu primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJeuById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
