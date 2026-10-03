package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data 
public class BrandRequest {
	
	@NotBlank(message = "Tên thương hiệu không được để trống")
	@Size(min=3, max = 255, message = "Tên thương hiệu phải từ 3 đến 255 ký tự")
	private String name;

	@NotBlank(message = "Slug không được để trống")
	@Size(min=3, max = 255, message = "Slug phải từ 3 đến 255 ký tự")
	private String slug;

	private String description;

	@Size(max = 255, message = "Đường dẫn logo không được vượt quá 255 ký tự")
	private String logo;

	
}
