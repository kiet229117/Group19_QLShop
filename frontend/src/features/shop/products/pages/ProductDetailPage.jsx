import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopLoading from '../../../../components/shop/common/ShopLoading';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import useShopQuery from '../../shared/hooks/useShopQuery';
import useShopCategories from '../../categories/hooks/useShopCategories';
import useShopBrands from '../../brands/hooks/useShopBrands';
import shopProductService from '../services/shopProductService';
import ProductGallery from '../components/ProductGallery';
import ProductDetailInfo from '../components/ProductDetailInfo';
import RelatedProducts from '../components/RelatedProducts';
import { shopPaths } from '../../shopPaths';

/**
 * Trang Chi tiết sản phẩm (`/shop/products/:slug`).
 * Gọi `GET /api/products/slug/{slug}` (ProductController).
 */
export default function ProductDetailPage() {
  const { slug } = useParams();
  const { categoryMap } = useShopCategories();
  const { brandMap } = useShopBrands();

  const productQuery = useShopQuery(
    (signal) => shopProductService.getBySlug(slug, signal),
    `product-detail::${slug}`,
    { enabled: Boolean(slug) }
  );

  const product = productQuery.data;
  const category =
    product?.categoryId != null ? categoryMap.get(String(product.categoryId)) : null;
  const brand = product?.brandId != null ? brandMap.get(String(product.brandId)) : null;

  if (productQuery.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ShopLoading label="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (productQuery.error || !product) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
        <ShopErrorState error={productQuery.error} onRetry={productQuery.refetch} />
        <div className="text-center">
          <ShopButton to={shopPaths.products()} variant="outline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Quay lại danh sách sản phẩm
          </ShopButton>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Sản phẩm', to: shopPaths.products() },
    category
      ? { label: category.name, to: shopPaths.categoryDetail(category.slug || category.id) }
      : null,
    { label: product.name },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={breadcrumbItems} />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ProductGallery key={product.id ?? product.slug} product={product} />
        </div>
        <div className="lg:col-span-6">
          <ProductDetailInfo
            key={product.id ?? product.slug}
            product={product}
            category={category}
            brand={brand}
          />
        </div>
      </div>

      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId}
        brandId={product.brandId}
        categoryMap={categoryMap}
        brandMap={brandMap}
      />
    </div>
  );
}
