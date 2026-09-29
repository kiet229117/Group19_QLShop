package com.group19.QLShop.dto.reponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CategoryReponse {
	@NotNull(message = "ID danh mục không được để trống")
	@Positive(message = "ID danh mục phải lớn hơn 0")
	private Long id;

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

	private boolean active;

	public CategoryReponse() {
	}

	public CategoryReponse(Long id, String name, String slug, String description, String image, boolean active) {
		this.id = id;
		this.name = name;
		this.slug = slug;
		this.description = description;
		this.image = image;
		this.active = active;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getSlug() {
		return slug;
	}

	public String getDescription() {
		return description;
	}

	public String getImage() {
		return image;
	}

	public boolean isActive() {
		return active;
	}
}
