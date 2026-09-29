package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class CategoryRequest {
	@NotBlank(message = "Tên danh mục không được để trống")
	@Size(max = 255, message = "Tên danh mục không được vượt quá 255 ký tự")
	private String name;

	@NotBlank(message = "Slug không được để trống")
	@Size(max = 255, message = "Slug không được vượt quá 255 ký tự")
	private String slug;

	@Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
	private String description;

	@Size(max = 500, message = "Ảnh không được vượt quá 500 ký tự")
	private String image;

	private boolean isActive;

	
}
