package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private Long id;
    private String title;
    private String image;
    private String linkUrl;
    private String position;
    private Integer displayOrder;
    private Boolean active;
    private String description;
}

