# Developer Quick Reference Guide

## Using the Enhanced API

### Import the API
```typescript
import { enhancedProductApi, isProductInStock, getStockStatus } from '@/lib/enhanced-api';
```

## Common Use Cases

### 1. Display Products on Homepage
```typescript
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const products = await enhancedProductApi.getFeatured(8);
      setFeaturedProducts(products);
    };
    loadFeatured();
  }, []);

  return (
    <div>
      {featuredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### 2. Product Listing with Filters
```typescript
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    search: '',
    inStock: false,
  });

  useEffect(() => {
    const loadProducts = async () => {
      const result = await enhancedProductApi.getProducts({
        ...filters,
        limit: 20,
        offset: 0,
      });
      setProducts(result.products);
    };
    loadProducts();
  }, [filters]);

  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      <ProductGrid products={products} />
    </div>
  );
};
```

### 3. Product Detail Page
```typescript
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      const prod = await enhancedProductApi.getProduct(Number(id));
      setProduct(prod);

      if (prod) {
        const related = await enhancedProductApi.getRelated(prod.id, 4);
        setRelatedProducts(related);
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <LoadingSpinner />;

  return (
    <div>
      <h1>{product.name_fr}</h1>
      <p>{product.description_fr}</p>
      <StockBadge status={getStockStatus(product.stock_quantity)} />
      <AddToCartButton
        disabled={!isProductInStock(product)}
        productId={product.id}
      />

      <RelatedProducts products={relatedProducts} />
    </div>
  );
};
```

### 4. Search Functionality
```typescript
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const products = await enhancedProductApi.search(searchQuery, {
        inStock: true, // Only show available products
      });
      setResults(products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length >= 3) {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {loading && <Spinner />}
      <SearchResults results={results} />
    </div>
  );
};
```

### 5. Category Navigation
```typescript
const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await enhancedProductApi.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  return (
    <nav>
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/products?category=${category.id}`}
        >
          {category.name_fr}
        </Link>
      ))}
    </nav>
  );
};
```

### 6. Stock Management
```typescript
const StockIndicator = ({ product }) => {
  const status = getStockStatus(product.stock_quantity);

  return (
    <div className={`stock-badge stock-${status}`}>
      {status === 'in_stock' && '✓ In Stock'}
      {status === 'low_stock' && `⚠ Only ${product.stock_quantity} left`}
      {status === 'out_of_stock' && '✗ Out of Stock'}
    </div>
  );
};

const AddToCartButton = ({ product }) => {
  const inStock = isProductInStock(product);

  return (
    <button
      disabled={!inStock}
      onClick={() => addToCart(product.id)}
      className={inStock ? 'btn-primary' : 'btn-disabled'}
    >
      {inStock ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
};
```

### 7. Price Filter Component
```typescript
const PriceFilter = ({ onChange }) => {
  const priceRange = enhancedProductApi.getPriceRange();
  const [min, setMin] = useState(priceRange.min);
  const [max, setMax] = useState(priceRange.max);

  const handleApply = () => {
    onChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="price-filter">
      <label>Price Range</label>
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        min={priceRange.min}
        max={priceRange.max}
      />
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        min={priceRange.min}
        max={priceRange.max}
      />
      <button onClick={handleApply}>Apply</button>
    </div>
  );
};
```

### 8. Brand Filter
```typescript
const BrandFilter = ({ onChange, selected }) => {
  const brands = enhancedProductApi.getBrands();

  return (
    <div className="brand-filter">
      <h3>Brands</h3>
      {brands.map(brand => (
        <label key={brand}>
          <input
            type="radio"
            name="brand"
            value={brand}
            checked={selected === brand}
            onChange={(e) => onChange(e.target.value)}
          />
          {brand}
        </label>
      ))}
      <button onClick={() => onChange(undefined)}>Clear</button>
    </div>
  );
};
```

### 9. Statistics Dashboard
```typescript
const StatsDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await enhancedProductApi.getStats();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="stats-grid">
      <StatCard
        title="Total Products"
        value={stats.totalProducts}
      />
      <StatCard
        title="Categories"
        value={stats.categories}
      />
      <StatCard
        title="Brands"
        value={stats.brands}
      />
      <StatCard
        title="Average Price"
        value={`${stats.averagePrice.toFixed(2)} MAD`}
      />
      <StatCard
        title="In Stock"
        value={stats.inStockCount}
        color="green"
      />
      <StatCard
        title="Out of Stock"
        value={stats.outOfStockCount}
        color="red"
      />
    </div>
  );
};
```

### 10. Pagination Example
```typescript
const PaginatedProductList = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const loadPage = async () => {
      const result = await enhancedProductApi.getProducts({
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      });
      setProducts(result.products);
      setHasMore(result.hasMore);
    };
    loadPage();
  }, [page]);

  return (
    <div>
      <ProductGrid products={products} />

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={!hasMore}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

## API Reference

### Main Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getProducts()` | `filters?: ProductFilters` | `Promise<PaginatedResponse>` | Get products with filtering |
| `getProduct()` | `id: number` | `Promise<EnhancedProduct \| null>` | Get single product |
| `getFeatured()` | `limit?: number` | `Promise<EnhancedProduct[]>` | Get featured products |
| `getByCategory()` | `categoryId: number, limit?: number` | `Promise<EnhancedProduct[]>` | Get products by category |
| `search()` | `query: string, filters?: ProductFilters` | `Promise<EnhancedProduct[]>` | Search products |
| `getRelated()` | `productId: number, limit?: number` | `Promise<EnhancedProduct[]>` | Get related products |
| `getCategories()` | - | `Promise<Category[]>` | Get all categories |
| `getBrands()` | - | `string[]` | Get all brands |
| `getPriceRange()` | - | `{min: number, max: number}` | Get price range |
| `getStats()` | - | `Promise<ProductStats>` | Get statistics |

### Filter Options

```typescript
interface ProductFilters {
  category?: number;        // Filter by category ID
  search?: string;          // Search in names/descriptions
  minPrice?: number;        // Minimum price
  maxPrice?: number;        // Maximum price
  brand?: string;           // Filter by brand
  inStock?: boolean;        // Only show in-stock items
  featured?: boolean;       // Only show featured items
  limit?: number;           // Number of items per page
  offset?: number;          // Skip items for pagination
}
```

### Utility Functions

```typescript
// Check if product is in stock
isProductInStock(product: Product): boolean

// Get stock status string
getStockStatus(stock: number): 'in_stock' | 'low_stock' | 'out_of_stock'
```

## Best Practices

1. **Always handle loading states**
```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const result = await enhancedProductApi.getProducts();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

2. **Use error boundaries**
```typescript
<ErrorBoundary fallback={<ErrorMessage />}>
  <ProductList />
</ErrorBoundary>
```

3. **Implement caching for better performance**
```typescript
const cache = new Map();

const getCachedProducts = async (key, fetcher) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetcher();
  cache.set(key, data);
  return data;
};
```

4. **Debounce search inputs**
```typescript
const debouncedSearch = useCallback(
  debounce((query) => {
    enhancedProductApi.search(query);
  }, 300),
  []
);
```

5. **Use React Query for advanced caching**
```typescript
const { data, isLoading, error } = useQuery(
  ['products', filters],
  () => enhancedProductApi.getProducts(filters),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);
```

## Troubleshooting

### Backend Not Available
The API automatically falls back to local data. Check console for:
```
Backend API unavailable, using local data
```

### Empty Results
Check your filters:
```typescript
const result = await enhancedProductApi.getProducts({ inStock: true });
console.log(result.total); // Number of matching products
```

### TypeScript Errors
Make sure to import types:
```typescript
import type { EnhancedProduct, ProductFilters } from '@/lib/enhanced-api';
```

---

**Last Updated**: October 25, 2025
**API Version**: v1.0
