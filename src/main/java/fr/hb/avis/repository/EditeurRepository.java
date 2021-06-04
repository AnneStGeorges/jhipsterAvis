package fr.hb.avis.repository;

import fr.hb.avis.domain.Editeur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Editeur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EditeurRepository extends JpaRepository<Editeur, Long> {}
