package fr.hb.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Jeu.
 */
@Entity
@Table(name = "jeu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Jeu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "date_sortie")
    private Instant dateSortie;

    @OneToMany(mappedBy = "jeu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "joueur", "jeu" }, allowSetters = true)
    private Set<Avis> avis = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "jeus" }, allowSetters = true)
    private Editeur editeur;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Jeu id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Jeu nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Jeu description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateSortie() {
        return this.dateSortie;
    }

    public Jeu dateSortie(Instant dateSortie) {
        this.dateSortie = dateSortie;
        return this;
    }

    public void setDateSortie(Instant dateSortie) {
        this.dateSortie = dateSortie;
    }

    public Set<Avis> getAvis() {
        return this.avis;
    }

    public Jeu avis(Set<Avis> avis) {
        this.setAvis(avis);
        return this;
    }

    public Jeu addAvis(Avis avis) {
        this.avis.add(avis);
        avis.setJeu(this);
        return this;
    }

    public Jeu removeAvis(Avis avis) {
        this.avis.remove(avis);
        avis.setJeu(null);
        return this;
    }

    public void setAvis(Set<Avis> avis) {
        if (this.avis != null) {
            this.avis.forEach(i -> i.setJeu(null));
        }
        if (avis != null) {
            avis.forEach(i -> i.setJeu(this));
        }
        this.avis = avis;
    }

    public Editeur getEditeur() {
        return this.editeur;
    }

    public Jeu editeur(Editeur editeur) {
        this.setEditeur(editeur);
        return this;
    }

    public void setEditeur(Editeur editeur) {
        this.editeur = editeur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Jeu)) {
            return false;
        }
        return id != null && id.equals(((Jeu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Jeu{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateSortie='" + getDateSortie() + "'" +
            "}";
    }
}
