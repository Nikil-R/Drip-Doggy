package com.dripdoggy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "gst")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gst {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private BigDecimal value;

    @Column(name = "is_active")
    private Boolean isActive;
}
