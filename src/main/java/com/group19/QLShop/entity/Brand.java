package com.group19.QLShop.entity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "brands")
public class Brand {
      @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String logo;

        @OneToMany (mappedBy = "category", cascade = CascadeType.ALL)
    List<Product> products;
}
