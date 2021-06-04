package fr.hb.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Editeur.
 */
@Entity
@Table(name = "editeur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Editeur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @OneToMany(mappedBy = "editeur")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avis", "editeur" }, allowSetters = true)
    private Set<Jeu> jeus = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Editeur id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Editeur nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Jeu> getJeus() {
        return this.jeus;
    }

    public Editeur jeus(Set<Jeu> jeus) {
        this.setJeus(jeus);
        return this;
    }

    public Editeur addJeu(Jeu jeu) {
        this.jeus.add(jeu);
        jeu.setEditeur(this);
        return this;
    }

    public Editeur removeJeu(Jeu jeu) {
        this.jeus.remove(jeu);
        jeu.setEditeur(null);
        return this;
    }

    public void setJeus(Set<Jeu> jeus) {
        if (this.jeus != null) {
            this.jeus.forEach(i -> i.setEditeur(null));
        }
        if (jeus != null) {
            jeus.forEach(i -> i.setEditeur(this));
        }
        this.jeus = jeus;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Editeur)) {
            return false;
        }
        return id != null && id.equals(((Editeur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Editeur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
