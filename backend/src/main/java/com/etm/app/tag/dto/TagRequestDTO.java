package com.etm.app.tag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TagRequestDTO(
    @NotBlank(message = "A descrição é obrigatória") @Size(max = 50) String descricao
) {}