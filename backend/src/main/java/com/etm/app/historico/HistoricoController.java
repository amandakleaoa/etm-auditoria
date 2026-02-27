package com.etm.app.historico;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {

    private final HistoricoRepository repository;

    public HistoricoController(HistoricoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/tarefa/{tarefaId}")
    public ResponseEntity<List<Historico>> buscarPorTarefa(@PathVariable Long tarefaId) {
        return ResponseEntity.ok(repository.findByTarefaIdOrderByTimestampDesc(tarefaId));
    }
}