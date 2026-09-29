package com.group19.QLShop.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.entity.Brand;

import com.group19.QLShop.repository.BrandRepository;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

@Service 
public class BrandService {

    private final BrandRepository brandRepository;
    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    
    // Xem tất cả
    public Page<Brand> getAllBrands(int page, int size) {
        Pageable data = PageRequest.of(page,size);
        return brandRepository.findAll(data);
    }

    // Thêm
    public Brand addBrand(Brand brand) {


        Brand newBrand = new Brand();
        newBrand.setName(brand.getName());
        newBrand.setSlug(brand.getSlug());
        newBrand.setDescription(brand.getDescription());
        newBrand.setLogo(brand.getLogo());
        return brandRepository.save(newBrand);

    }

    // sửa
    public Brand uppdateBrand(Long id, Brand brand) {
        Brand exists = brandRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu"));
        exists.setName(brand.getName());
        exists.setDescription(brand.getDescription());
        exists.setSlug(brand.getSlug());
        exists.setLogo(brand.getLogo());
        return brandRepository.save(exists);
        
    }

    // Xóa
    public void deleteBrand(Long id) {
        Brand exists = brandRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu"));

        brandRepository.delete(exists);
    }
}
