package com.group19.QLShop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.BrandReponse;
import com.group19.QLShop.dto.request.BrandRequest;
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.repository.BrandRepository;

@Service 
public class BrandService {

    private final BrandRepository brandRepository;
    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    
    // Xem tất cả (Chuyển đổi Page sang DTO Response)
    public Page<BrandReponse> getAllBrands(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Brand> brands = brandRepository.findAll(pageable);
        return brands.map(this::toResponse);
    }

    // Thêm (Nhận Request DTO -> Lưu và trả về Response DTO)
    public BrandReponse addBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên thương hiệu '" + request.getName() + "' đã tồn tại trên hệ thống");
        }
        if (brandRepository.existsBySlug(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại trên hệ thống");
        }
        Brand newBrand = new Brand();
        newBrand.setName(request.getName());
        newBrand.setSlug(request.getSlug());
        newBrand.setDescription(request.getDescription());
        newBrand.setLogo(request.getLogo());
        
        Brand savedBrand = brandRepository.save(newBrand);
        return toResponse(savedBrand);
    }

    // Sửa (Nhận Request DTO -> Cập nhật và trả về Response DTO)
    public BrandReponse updateBrand(Long id, BrandRequest request) {
     
        Brand exists = brandRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu với ID: " + id));
        

        if (brandRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên thương hiệu '" + request.getName() + "' đã tồn tại trên hệ thống");
        }
        if (brandRepository.existsBySlug(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại trên hệ thống");
        }
        exists.setName(request.getName());
        exists.setDescription(request.getDescription());
        exists.setSlug(request.getSlug());
        exists.setLogo(request.getLogo());
        
        Brand updatedBrand = brandRepository.save(exists);
        return toResponse(updatedBrand);
    }

    // Xóa
    public void deleteBrand(Long id) {
        Brand exists = brandRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu với ID: " + id));

        // Lưu ý: Tương tự như Category, nên kiểm tra xem có Product nào đang thuộc thương hiệu này không trước khi xóa
        brandRepository.delete(exists);
    }

    // Hàm chuyển đổi (Mapping) chuẩn từ Entity sang Response DTO
    private BrandReponse toResponse(Brand brand) {
        BrandReponse response = new BrandReponse();
        response.setId(brand.getId());
        response.setName(brand.getName());
        response.setSlug(brand.getSlug());
        response.setDescription(brand.getDescription());
        response.setLogo(brand.getLogo());
        return response;
    }
}
