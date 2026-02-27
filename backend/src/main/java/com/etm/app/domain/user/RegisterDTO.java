package com.etm.app.domain.user;

import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(
    @NotBlank String login, 
    @NotBlank String password, 
    UserRole role
) {}