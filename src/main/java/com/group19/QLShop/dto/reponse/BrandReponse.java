package com.group19.QLShop.dto.reponse;

public class BrandReponse {
	private Long id;
	private String name;
	private String slug;
	private String description;
	private String logo;

	public BrandReponse() {
	}

	public BrandReponse(Long id, String name, String slug, String description, String logo) {
		this.id = id;
		this.name = name;
		this.slug = slug;
		this.description = description;
		this.logo = logo;
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

	public String getLogo() {
		return logo;
	}
}
