package com.group19.QLShop.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.group19.QLShop.dto.request.CategoryRequest;
import com.group19.QLShop.dto.reponse.CategoryReponse;
import com.group19.QLShop.entity.Category;
import com.group19.QLShop.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

   
    public Page<CategoryReponse> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryRepository.findAll(pageable);
        
        return categories.map(this::toResponse);
    }

  
    public CategoryReponse addCategory(CategoryRequest request) {
        Category newCategory = new Category();
        newCategory.setName(request.getName());
        newCategory.setSlug(request.getSlug());
        newCategory.setDescription(request.getDescription());
        newCategory.setImage(request.getImage());
        newCategory.setActive(request.isActive()); 

        Category savedCategory = categoryRepository.save(newCategory);
        return toResponse(savedCategory);
    }

    public CategoryReponse updateCategory(Long id, CategoryRequest request) {
        Category exists = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + id));
        exists.setName(request.getName());
        exists.setDescription(request.getDescription());
        exists.setSlug(request.getSlug());
        exists.setImage(request.getImage());
        exists.setActive(request.isActive());
        
        Category updatedCategory = categoryRepository.save(exists);
        return toResponse(updatedCategory);
    }

    
    public void deleteCategory(Long id) {
        Category exists = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + id));

        categoryRepository.delete(exists);
    }

    private CategoryReponse toResponse(Category category) {
        CategoryReponse response = new CategoryReponse();
      response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setDescription(category.getDescription());
        response.setImage(category.getImage());
        response.setActive(category.isActive());
        return response;
    }
}
