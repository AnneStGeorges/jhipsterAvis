package fr.hb.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Avis.
 */
@Entity
@Table(name = "avis")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Avis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "note")
    private Float note;

    @Column(name = "description")
    private String description;

    @Column(name = "date_envoi")
    private Instant dateEnvoi;

    @ManyToOne
    @JsonIgnoreProperties(value = { "avis" }, allowSetters = true)
    private Joueur joueur;

    @ManyToOne
    @JsonIgnoreProperties(value = { "avis", "editeur" }, allowSetters = true)
    private Jeu jeu;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Avis id(Long id) {
        this.id = id;
        return this;
    }

    public Float getNote() {
        return this.note;
    }

    public Avis note(Float note) {
        this.note = note;
        return this;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    public String getDescription() {
        return this.description;
    }

    public Avis description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateEnvoi() {
        return this.dateEnvoi;
    }

    public Avis dateEnvoi(Instant dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
        return this;
    }

    public void setDateEnvoi(Instant dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Joueur getJoueur() {
        return this.joueur;
    }

    public Avis joueur(Joueur joueur) {
        this.setJoueur(joueur);
        return this;
    }

    public void setJoueur(Joueur joueur) {
        this.joueur = joueur;
    }

    public Jeu getJeu() {
        return this.jeu;
    }

    public Avis jeu(Jeu jeu) {
        this.setJeu(jeu);
        return this;
    }

    public void setJeu(Jeu jeu) {
        this.jeu = jeu;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Avis)) {
            return false;
        }
        return id != null && id.equals(((Avis) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Avis{" +
            "id=" + getId() +
            ", note=" + getNote() +
            ", description='" + getDescription() + "'" +
            ", dateEnvoi='" + getDateEnvoi() + "'" +
            "}";
    }
}
