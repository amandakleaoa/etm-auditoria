package com.etm.app.categoria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
    @NotBlank(message = "O nome é obrigatório") @Size(max = 100) String nome,
    @NotBlank(message = "A cor é obrigatória") @Size(min = 4, max = 7) String corHexadecimal
) {}