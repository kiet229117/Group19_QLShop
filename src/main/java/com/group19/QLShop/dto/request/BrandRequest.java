package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data 
public class BrandRequest {
	
	@NotBlank(message = "Tên thương hiệu không được để trống")
	@Size(max = 255, message = "Tên thương hiệu không được vượt quá 255 ký tự")
	private String name;

	@NotBlank(message = "Slug không được để trống")
	@Size(max = 255, message = "Slug không được vượt quá 255 ký tự")
	private String slug;

	@Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
	private String description;

	// Trường logo thường lưu đường dẫn ảnh (URL) hoặc tên file ảnh
	@Size(max = 255, message = "Đường dẫn logo không được vượt quá 255 ký tự")
	private String logo;

	
}
