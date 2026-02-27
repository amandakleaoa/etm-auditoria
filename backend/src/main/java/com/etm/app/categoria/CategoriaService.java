package com.etm.app.categoria;

import com.etm.app.categoria.dto.CategoriaRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CategoriaService {
    
    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<Categoria> listar() {
        return repository.findAll();
    }

    @Transactional
    public Categoria criar(CategoriaRequestDTO dto) {
        if (repository.existsByNome(dto.nome())) {
            throw new IllegalArgumentException("Já existe uma categoria ativa com este nome.");
        }

        Categoria cat = new Categoria();
        cat.setNome(dto.nome());
        cat.setCorHexadecimal(dto.corHexadecimal());
        return repository.save(cat);
    }

    @Transactional
    public Categoria atualizar(Long id, CategoriaRequestDTO dto) {
        Categoria cat = repository.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));

        if (!cat.getNome().equalsIgnoreCase(dto.nome()) && repository.existsByNome(dto.nome())) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome.");
        }

        cat.setNome(dto.nome());
        cat.setCorHexadecimal(dto.corHexadecimal());
        return repository.save(cat);
    }

    @Transactional
    public void deletar(Long id) {
        Categoria cat = repository.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));
        
        cat.setNome(cat.getNome() + "_del_" + System.currentTimeMillis());
        repository.saveAndFlush(cat);

        repository.delete(cat);
    }
}