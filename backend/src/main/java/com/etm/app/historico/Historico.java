package com.etm.app.historico;

import com.etm.app.tarefa.Tarefa;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "historico")
public class Historico {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "historico_seq")
    @SequenceGenerator(name = "historico_seq", sequenceName = "historico_seq", allocationSize = 50)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tarefa_id", nullable = false)
    private Tarefa tarefa;

    @Column(columnDefinition = "jsonb", nullable = false)
    private String alteracao; 

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}