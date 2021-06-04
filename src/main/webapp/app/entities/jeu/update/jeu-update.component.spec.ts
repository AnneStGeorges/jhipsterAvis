jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JeuService } from '../service/jeu.service';
import { IJeu, Jeu } from '../jeu.model';
import { IEditeur } from 'app/entities/editeur/editeur.model';
import { EditeurService } from 'app/entities/editeur/service/editeur.service';

import { JeuUpdateComponent } from './jeu-update.component';

describe('Component Tests', () => {
  describe('Jeu Management Update Component', () => {
    let comp: JeuUpdateComponent;
    let fixture: ComponentFixture<JeuUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jeuService: JeuService;
    let editeurService: EditeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JeuUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JeuUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JeuUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jeuService = TestBed.inject(JeuService);
      editeurService = TestBed.inject(EditeurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Editeur query and add missing value', () => {
        const jeu: IJeu = { id: 456 };
        const editeur: IEditeur = { id: 65602 };
        jeu.editeur = editeur;

        const editeurCollection: IEditeur[] = [{ id: 77374 }];
        spyOn(editeurService, 'query').and.returnValue(of(new HttpResponse({ body: editeurCollection })));
        const additionalEditeurs = [editeur];
        const expectedCollection: IEditeur[] = [...additionalEditeurs, ...editeurCollection];
        spyOn(editeurService, 'addEditeurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        expect(editeurService.query).toHaveBeenCalled();
        expect(editeurService.addEditeurToCollectionIfMissing).toHaveBeenCalledWith(editeurCollection, ...additionalEditeurs);
        expect(comp.editeursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jeu: IJeu = { id: 456 };
        const editeur: IEditeur = { id: 69104 };
        jeu.editeur = editeur;

        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jeu));
        expect(comp.editeursSharedCollection).toContain(editeur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = { id: 123 };
        spyOn(jeuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jeu }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jeuService.update).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = new Jeu();
        spyOn(jeuService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jeu }));
        saveSubject.complete();

        // THEN
        expect(jeuService.create).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = { id: 123 };
        spyOn(jeuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jeuService.update).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEditeurById', () => {
        it('Should return tracked Editeur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEditeurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
