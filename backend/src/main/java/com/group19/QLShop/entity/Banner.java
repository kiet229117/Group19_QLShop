package com.group19.QLShop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String image;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(length = 50)
    private String position;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(nullable = false)
    private Boolean active;

    private String description;
}
