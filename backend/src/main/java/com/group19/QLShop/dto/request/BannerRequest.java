package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {

    @NotBlank(message = "Tiêu đề banner không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String title;

    @NotBlank(message = "Đường dẫn ảnh banner không được để trống")
    @Size(max = 500, message = "Đường dẫn ảnh không được vượt quá 500 ký tự")
    private String image;

    @Size(max = 500, message = "Đường dẫn link không được vượt quá 500 ký tự")
    private String linkUrl;

    @Size(max = 50, message = "Vị trí hiển thị không được vượt quá 50 ký tự")
    private String position;

    private Integer displayOrder;

    private Boolean active;

    private String description;
}

