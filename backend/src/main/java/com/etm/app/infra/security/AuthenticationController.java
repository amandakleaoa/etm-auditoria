package com.etm.app.infra.security;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.etm.app.domain.user.AuthenticationDTO;
import com.etm.app.domain.user.LoginResponseDTO;
import com.etm.app.domain.user.RegisterDTO;
import com.etm.app.domain.user.User;
import com.etm.app.domain.user.UserRepository;
import com.etm.app.domain.user.UserRole;
import com.etm.app.services.TokenService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoints para Login e Registro de Usuários")
public class AuthenticationController {
	
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final UserRepository userRepository;
	
    public AuthenticationController(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, TokenService tokenService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO dto) {
        if (userRepository.existsByLogin(dto.login())) {
            return ResponseEntity.badRequest().body("Login já cadastrado");
        }
		
        // Criação do usuário sem o campo name, que estava causando o erro
        User user = User.builder()
              .login(dto.login())
              .password(passwordEncoder.encode(dto.password()))
              .role(dto.role()!= null? dto.role() : UserRole.USER)
              .build();
        
        userRepository.save(user);
        return ResponseEntity.status(201).build();
    }
		
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.login(), dto.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        var user = (User) auth.getPrincipal();
        String jwt = tokenService.generateToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(jwt));
    }
}