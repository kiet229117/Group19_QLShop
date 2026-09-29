package com.group19.QLShop.service;

import com.group19.QLShop.entity.Product;
import com.group19.QLShop.repository.BrandRepository;
import com.group19.QLShop.repository.CategoryRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.entity.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service 
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    public ProductService(ProductRepository productRepository, BrandRepository brandRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    // Xem sp bằng slug
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với slug:" + slug));
    }
    // Xem tất cả
    public Page<Product> getAllProducts(int page, int size) {
        Pageable data = PageRequest.of(page,size);
        return productRepository.findAll(data);
    }

    // Thêm
    public Product addProduct(Product product) {

        if(product.getBrand() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Thương hiệu không được để trống");
        }
        Brand brand = brandRepository.findById(product.getBrand().getId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu"));

        if(product.getCategory() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Danh mục không được để trống");
        }
        Category category = categoryRepository.findById(product.getCategory().getId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));

        Product newProduct = new Product();
        newProduct.setName(product.getName());
        newProduct.setBrand(brand);
        newProduct.setCategory(category);
        newProduct.setPrice(product.getPrice());
        newProduct.setDescription(product.getDescription());
        newProduct.setSlug(product.getSlug());
        newProduct.setRating(product.getRating());
  

        return productRepository.save(newProduct);


    }

    // sửa
    public Product uppdateProduct(Long id, Product product) {
        Product exists = productRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        if(product.getBrand() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Thương hiệu không được để trống");
        }
        Brand brand = brandRepository.findById(product.getBrand().getId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu"));

        if(product.getCategory() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Danh mục không được để trống");
        }
        Category category = categoryRepository.findById(product.getCategory().getId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));

        exists.setName(product.getName());
        exists.setBrand(brand);
        exists.setCategory(category);
        exists.setPrice(product.getPrice());
        exists.setDescription(product.getDescription());
        exists.setSlug(product.getSlug());
        exists.setRating(product.getRating());

        return productRepository.save(exists);
        
    }

    // Xóa
    public void deleteProduct(Long id) {
        Product exists = productRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        productRepository.delete(exists);
    }
}
