package com.group19.QLShop;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.group19.QLShop.controller.CategoryController;
import com.group19.QLShop.controller.ProductController;
import com.group19.QLShop.dto.reponse.CategoryReponse;
import com.group19.QLShop.dto.reponse.ProductReponse;
import com.group19.QLShop.service.CategoryService;
import com.group19.QLShop.service.ProductService;

import jakarta.validation.Validation;
import jakarta.validation.Validator;

class ProductCategoryValidationTests {
	private MockMvc categoryMvc;
	private MockMvc productMvc;
	private CategoryService categoryService;
	private ProductService productService;
	private Validator validator;

	@BeforeEach
	void setUp() {
		categoryService = mock(CategoryService.class);
		productService = mock(ProductService.class);
		categoryMvc = MockMvcBuilders.standaloneSetup(new CategoryController(categoryService)).build();
		productMvc = MockMvcBuilders.standaloneSetup(new ProductController(productService)).build();
		validator = Validation.buildDefaultValidatorFactory().getValidator();
	}

	@Test
	void invalidCategoryRequestReturnsBadRequest() throws Exception {
		categoryMvc.perform(post("/api/categories")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\" \",\"slug\":\"\"}"))
			.andExpect(status().isBadRequest());

		verifyNoInteractions(categoryService);
	}

	@Test
	void invalidProductRequestReturnsBadRequest() throws Exception {
		productMvc.perform(post("/api/products")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\" \",\"price\":0,\"rating\":6,\"slug\":\"\",\"brandId\":0,\"categoryId\":0}"))
			.andExpect(status().isBadRequest());

		verifyNoInteractions(productService);
	}

	@Test
	void responseDtosAreValidated() {
		assertFalse(validator.validate(new CategoryReponse()).isEmpty());
		assertFalse(validator.validate(new ProductReponse()).isEmpty());
		assertTrue(validator.validate(new CategoryReponse(1L, "Áo", "ao", null, null, true)).isEmpty());
	}
}