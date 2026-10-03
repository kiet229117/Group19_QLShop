package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class CategoryRequest {
	@NotBlank(message = "Tên danh mục không được để trống")
	@Size(min=3, max = 255, message = "Tên danh mục phải từ 3 đến 255 ký tự")
	private String name;

	@NotBlank(message = "Slug không được để trống")
	@Size(min=3, max = 255, message = "Slug phải từ 3 đến 255 ký tự")
	private String slug;

	private String description;

	@Size(max = 500, message = "Ảnh không được vượt quá 500 ký tự")
	private String image;

	private boolean isActive;

	
}
