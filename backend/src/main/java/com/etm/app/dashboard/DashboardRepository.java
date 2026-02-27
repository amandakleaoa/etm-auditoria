package com.etm.app.dashboard;

import com.etm.app.dashboard.dto.EstatisticaCategoriaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DashboardRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<EstatisticaCategoriaDTO> obterEstatisticas() {
        String sql = """
            SELECT 
                c.nome, 
                c.cor_hexadecimal, 
                COUNT(t.id) as total_tarefas,
                SUM(CASE WHEN t.status = 'CONCLUIDA' THEN 1 ELSE 0 END) as concluidas
            FROM categoria c
            LEFT JOIN tarefa t ON c.id = t.categoria_id AND t.deleted = false
            WHERE c.deleted = false
            GROUP BY c.id, c.nome, c.cor_hexadecimal
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new EstatisticaCategoriaDTO(
                rs.getString("nome"),
                rs.getString("cor_hexadecimal"),
                rs.getLong("total_tarefas"),
                rs.getLong("concluidas")
        ));
    }
}