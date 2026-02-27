package com.etm.app.categoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Note como fica limpo. O @SoftDelete já garante que só vai buscar os ativos!
    boolean existsByNome(String nome);
}