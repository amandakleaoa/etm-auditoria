package com.etm.app.tag;

import com.etm.app.tag.dto.TagRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TagService {
    
    private final TagRepository repository;

    public TagService(TagRepository repository) {
        this.repository = repository;
    }

    public List<Tag> listar() {
        return repository.findAll();
    }

    @Transactional
    public Tag criar(TagRequestDTO dto) {
        if (repository.existsByDescricao(dto.descricao())) {
            throw new IllegalArgumentException("Já existe uma tag ativa com esta descrição.");
        }

        Tag tag = new Tag();
        tag.setDescricao(dto.descricao());
        return repository.save(tag);
    }

    @Transactional
    public Tag atualizar(Long id, TagRequestDTO dto) {
        Tag tag = repository.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Tag não encontrada."));

        if (!tag.getDescricao().equalsIgnoreCase(dto.descricao()) &&
            repository.existsByDescricao(dto.descricao())) {
            throw new IllegalArgumentException("Já existe uma tag com esta descrição.");
        }

        tag.setDescricao(dto.descricao());
        return repository.save(tag);
    }

    @Transactional
    public void deletar(Long id) {
        Tag tag = repository.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Tag não encontrada."));
        
        tag.setDescricao(tag.getDescricao() + "_del_" + System.currentTimeMillis());
        repository.saveAndFlush(tag);

        repository.delete(tag);
    }
}