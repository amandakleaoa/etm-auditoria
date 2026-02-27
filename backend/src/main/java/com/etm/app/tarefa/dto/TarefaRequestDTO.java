package com.etm.app.tarefa.dto;

import com.etm.app.tarefa.Tarefa.StatusTarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Set;

public record TarefaRequestDTO(
    @NotBlank(message = "O título é obrigatório") String titulo,
    String descricao,
    @NotNull(message = "O status não pode ser nulo") StatusTarefa status,
    @NotNull(message = "A prioridade é obrigatória") Integer prioridade,
    LocalDateTime dataEntrega,
    @NotNull(message = "A categoria é obrigatória") Long categoriaId,
    Set<Long> tagIds
) {}