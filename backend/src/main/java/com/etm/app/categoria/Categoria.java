package com.etm.app.categoria;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

@Data
@NoArgsConstructor
@Entity
@Table(name = "categoria")
@SoftDelete(columnName = "deleted")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "categoria_seq")
    @SequenceGenerator(name = "categoria_seq", sequenceName = "categoria_seq", allocationSize = 50)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "cor_hexadecimal", length = 7)
    private String corHexadecimal;
}