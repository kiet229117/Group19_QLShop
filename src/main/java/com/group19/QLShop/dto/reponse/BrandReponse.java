package com.group19.QLShop.dto.reponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder                
@NoArgsConstructor       
@AllArgsConstructor      
public class BrandReponse {
	@NotNull(message = "ID sản phẩm không được để trống")
	@Positive(message = "ID sản phẩm phải lớn hơn 0")
	private Long id;
	@NotBlank(message = "Tên thương hiệu không được để trống")
	@Size(max = 255, message = "Tên thương hiệu không được vượt quá 255 ký tự")
	private String name;

	@NotBlank(message = "Slug không được để trống")
	@Size(max = 255, message = "Slug không được vượt quá 255 ký tự")
	private String slug;

	@Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
	private String description;

	@Size(max = 500, message = "Logo không được vượt quá 500 ký tự")
	private String logo;

}
