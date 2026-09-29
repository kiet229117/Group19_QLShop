package com.group19.QLShop.dto.reponse;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class ProductReponse {
	@NotNull(message = "ID sản phẩm không được để trống")
	@Positive(message = "ID sản phẩm phải lớn hơn 0")
	private Long id;

	@NotBlank(message = "Tên sản phẩm không được để trống")
	@Size(max = 255, message = "Tên sản phẩm không được vượt quá 255 ký tự")
	private String name;

	@NotNull(message = "Giá sản phẩm không được để trống")
	@Positive(message = "Giá sản phẩm phải lớn hơn 0")
	private Double price;

	@Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
	private String description;

	@NotNull(message = "Đánh giá không được để trống")
	@DecimalMin(value = "0.0", message = "Đánh giá không được nhỏ hơn 0")
	@DecimalMax(value = "5.0", message = "Đánh giá không được lớn hơn 5")
	private Double rating;

	@NotBlank(message = "Slug không được để trống")
	@Size(max = 255, message = "Slug không được vượt quá 255 ký tự")
	private String slug;

	@NotNull(message = "Thương hiệu không được để trống")
	@Positive(message = "ID thương hiệu phải lớn hơn 0")
	private Long brandId;

	@NotNull(message = "Danh mục không được để trống")
	@Positive(message = "ID danh mục phải lớn hơn 0")
	private Long categoryId;

	public ProductReponse() {
	}

	public ProductReponse(Long id, String name, Double price, String description, Double rating, String slug,
			Long brandId, Long categoryId) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.description = description;
		this.rating = rating;
		this.slug = slug;
		this.brandId = brandId;
		this.categoryId = categoryId;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public Double getPrice() {
		return price;
	}

	public String getDescription() {
		return description;
	}

	public Double getRating() {
		return rating;
	}

	public String getSlug() {
		return slug;
	}

	public Long getBrandId() {
		return brandId;
	}

	public Long getCategoryId() {
		return categoryId;
	}
}
