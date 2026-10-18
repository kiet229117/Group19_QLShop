package com.group19.QLShop.dto.reponse;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchSuggestionResponse {

    private String keyword;                          // Từ khóa người dùng vừa gõ
    private List<String> keywordSuggestions;         // Danh sách cụm từ gợi ý (VD: Áo thun nam, Áo thun cổ tròn...)
    private List<ProductSuggestionItem> products;    // Top các mẫu áo khớp nhất có kèm ảnh và giá
}

