package com.etm.app.dashboard;

import com.etm.app.dashboard.dto.EstatisticaCategoriaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final DashboardRepository repository;

    @GetMapping("/categorias")
    public ResponseEntity<List<EstatisticaCategoriaDTO>> getEstatisticas() {
        return ResponseEntity.ok(repository.obterEstatisticas());
    }
}