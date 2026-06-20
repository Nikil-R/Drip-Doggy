package com.dripdoggy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tagline;
    private String title;
    private String description;

    @Column(name = "redirect_to")
    private String redirectTo;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToOne(mappedBy = "banner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Image image;
}
