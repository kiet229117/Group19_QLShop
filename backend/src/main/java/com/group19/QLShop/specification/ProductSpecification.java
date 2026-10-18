package com.group19.QLShop.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.group19.QLShop.dto.request.ProductFilterRequest;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductPrice;
import com.group19.QLShop.entity.ProductVariant;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    public static Specification<Product> filter(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.conjunction();
            }

            // 1. Tìm kiếm theo từ khóa (trong tên hoặc mô tả sản phẩm)
            if (filter.getKeyword() != null && !filter.getKeyword().trim().isEmpty()) {
                String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(nameLike, descLike));
            }

            // 2. Lọc theo Thương hiệu (Brand ID)
            if (filter.getBrandId() != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), filter.getBrandId()));
            }

            // 3. Lọc theo Danh mục (Category ID)
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            // 4. Lọc theo Khoảng giá
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            // 5. Lọc theo Áo Hot
            if (Boolean.TRUE.equals(filter.getIsHot())) {
                predicates.add(cb.isTrue(root.get("isHot")));
            }

            // 6. Lọc theo Size, Màu sắc và Tình trạng tồn kho (Join bảng product_variants)
            boolean needVariantJoin = (filter.getShirtSize() != null && !filter.getShirtSize().trim().isEmpty())
                    || (filter.getColor() != null && !filter.getColor().trim().isEmpty())
                    || Boolean.TRUE.equals(filter.getInStock());

            if (needVariantJoin) {
                query.distinct(true);
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.INNER);

                if (filter.getShirtSize() != null && !filter.getShirtSize().trim().isEmpty()) {
                    predicates.add(cb.equal(cb.upper(variantJoin.get("size")), filter.getShirtSize().trim().toUpperCase()));
                }

                if (filter.getColor() != null && !filter.getColor().trim().isEmpty()) {
                    predicates.add(cb.like(cb.lower(variantJoin.get("color")), "%" + filter.getColor().trim().toLowerCase() + "%"));
                }

                if (Boolean.TRUE.equals(filter.getInStock())) {
                    predicates.add(cb.greaterThan(variantJoin.get("stockQuantity"), 0));
                }
            }

            // 7. Lọc các sản phẩm đang có Flash Sale / Khuyến mãi hợp lệ
            if (Boolean.TRUE.equals(filter.getHasSale())) {
                query.distinct(true);
                Join<Product, ProductPrice> priceJoin = root.join("productPrice", JoinType.INNER);
                predicates.add(cb.isNotNull(priceJoin.get("salePrice")));
                predicates.add(cb.greaterThan(priceJoin.get("salePrice"), 0.0));
                predicates.add(cb.lessThan(priceJoin.get("salePrice"), root.get("price")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
