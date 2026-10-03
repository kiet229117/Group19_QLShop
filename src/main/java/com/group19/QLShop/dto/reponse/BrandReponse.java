package com.group19.QLShop.dto.reponse;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder                
@NoArgsConstructor       
@AllArgsConstructor      
public class BrandReponse {
	private Long id;
	private String name;

	private String slug;

	private String description;

	private String logo;

}
