package com.etm.app.tarefa;

import com.etm.app.categoria.Categoria;
import com.etm.app.categoria.CategoriaRepository;
import com.etm.app.tag.TagRepository;
import com.etm.app.tarefa.dto.TarefaRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefaService {
    private final TarefaRepository tarefaRepository;
    private final CategoriaRepository categoriaRepository;
    private final TagRepository tagRepository;

    public List<Tarefa> listar() {
        return tarefaRepository.findAll();
    }

    @Transactional
    public Tarefa criar(TarefaRequestDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
               .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));

        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(dto.titulo());
        tarefa.setDescricao(dto.descricao());
        tarefa.setStatus(dto.status());
        tarefa.setPrioridade(dto.prioridade());
        tarefa.setDataEntrega(dto.dataEntrega());
        tarefa.setCategoria(categoria);

        if (dto.tagIds()!= null &&!dto.tagIds().isEmpty()) {
            tarefa.setTags(new HashSet<>(tagRepository.findAllById(dto.tagIds())));
        }

        return tarefaRepository.save(tarefa);
    }

    @Transactional
    public Tarefa atualizar(Long id, TarefaRequestDTO dto) {
        Tarefa tarefa = tarefaRepository.findById(id)
               .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada."));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
               .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));

        tarefa.setTitulo(dto.titulo());
        tarefa.setDescricao(dto.descricao());
        tarefa.setStatus(dto.status());
        tarefa.setPrioridade(dto.prioridade());
        tarefa.setDataEntrega(dto.dataEntrega());
        tarefa.setCategoria(categoria);

        if (dto.tagIds()!= null) {
            tarefa.setTags(new HashSet<>(tagRepository.findAllById(dto.tagIds())));
        }

        return tarefaRepository.save(tarefa);
    }

    @Transactional
    public void deletar(Long id) {
        if (!tarefaRepository.existsById(id)) throw new EntityNotFoundException("Tarefa não encontrada.");
        tarefaRepository.deleteById(id);
    }
}