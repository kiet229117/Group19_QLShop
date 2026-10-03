package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data 
public class ProductRequest {
	@NotBlank(message = "Tên sản phẩm không được để trống")
	@Size(min = 3, max = 255, message = "Tên sản phẩm phải từ 3 đến 255 ký tự")
	private String name;

	@NotNull(message = "Giá sản phẩm không được để trống")
	@Positive(message = "Giá sản phẩm phải lớn hơn 0")
	private Double price;

	private String description;

	@NotNull(message = "Đánh giá không được để trống")
	@DecimalMin(value = "0.0", message = "Đánh giá không được nhỏ hơn 0")
	@DecimalMax(value = "5.0", message = "Đánh giá không được lớn hơn 5")
	private Double rating;

	@NotBlank(message = "Slug không được để trống")
	@Size(min=3,max = 255, message = "Slug phải từ 3 đến 255 ký tự")
	private String slug;

	@NotNull(message = "Thương hiệu không được để trống")
	private Long brandId;

	@NotNull(message = "Danh mục không được để trống")
	private Long categoryId;

	
}
