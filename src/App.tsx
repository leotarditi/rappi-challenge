import { useMemo, useState } from "react";
import { categories } from "./data/categories.json";
import { products } from "./data/products.json";
import './App.css'

interface Category {
  id: number;
  name: string;
  sublevels?: Category[];
}

type MenuProps = {
  categories: Category[];
  onCategoryClick: (category: Category | null) => void;
}

type MenuItemProps = {
  category: Category;
  onClick: (category: Category | null) => void;
}

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  available: boolean;
  sublevel_id: number;
}

type CartItem = {
  quantity: number;
  product: Product;
}

function MenuItem({ category, onClick }: MenuItemProps) {
  const [isCollapsed, collapse] = useState(false);

  function handleCollapse(event: React.MouseEvent) {
    event.stopPropagation();
    
    if(isCollapsed) {
      onClick(null)
    }
    collapse((isCollapsed) => !isCollapsed)
  }

  return (
    <li className="menu-item">
      <div onClick={() => onClick(category)} className="menu-item-header">
        <span>{category.name}</span>
        {category.sublevels && (
          <button onClick={handleCollapse} className="collapse-button">
            {isCollapsed ? 'x' : '+'}
          </button>
        )}
      </div>

      {category.sublevels && (
        <ul
          className={`menu-item-sublevels ${isCollapsed ? 'open' : ''}`}
        >
          <Menu onCategoryClick={onClick} categories={category.sublevels} />
        </ul>
      )}
    </li>
  );
}

function Menu({ categories, onCategoryClick }: MenuProps) {
  return (
    <ol className="menu">
      {categories.map((category) => (
        <MenuItem onClick={onCategoryClick} key={category.id} category={category} />
      ))}
    </ol>
  );
}

function App() {
  const [category, setCategory] = useState<Category | null>(null);
  const [cart, setCart] = useState<Map<Product['id'], CartItem>>(() => new Map<Product['id'], CartItem>());
  
  const [filters, setFilters] = useState({
    available: false,
    minPrice: 0,
    maxPrice: Infinity,
    minQuantity: 0,
    maxQuantity: Infinity,
  });
  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<"price" | "quantity" | "available" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const matches = useMemo(() => 
    products.filter((product) => {
      const byCategory = category ? product.sublevel_id === category.id : true;
      const byAvailability = !filters.available || product.available;
      const byPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const byQuantity = product.quantity >= filters.minQuantity && product.quantity <= filters.maxQuantity;
      const bySearch = product.name.toLowerCase().includes(search.toLowerCase());

      return byCategory && byAvailability && byPrice && byQuantity && bySearch;
    }),
    [category, filters, search]
  );  

  const sortedMatches = useMemo(() => {
    const sorted = [...matches];
    if (sort) {
      sorted.sort((a, b) => {
        const comparison = sort === "available"
          ? Number(b[sort]) - Number(a[sort]) 
          : a[sort] - b[sort]; 
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return sorted;
  }, [matches, sort, sortDirection]);  

  function handleDecrement(product: Product) {
    const draft = structuredClone(cart);
    const item = draft.get(product.id);

    if (item) {
      if (item.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        draft.delete(product.id);
      }
    }

    setCart(draft);
  }

  function handleIncrement(product: Product) {
    const draft = structuredClone(cart);
    const item = draft.get(product.id);

    if (!item) {
      draft.set(product.id, {
        quantity: 1,
        product
      });
    } else {
      item.quantity = item.quantity + 1;
    }

    setCart(draft);
  }

  return (
    <div className="app-container">
      <Menu onCategoryClick={(category) => setCategory(category)} categories={categories} />
      <div className="main-content">
        <div className="search-container">
          <label>
            Buscar:
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="search-input"
            />
          </label>
        </div>
        <div className="filters-container">
          <label className="checkbox-label">
            Solo disponibles
            <input 
              type="checkbox" 
              checked={filters.available}
              onChange={() => setFilters({ ...filters, available: !filters.available })}
            /> 
          </label>
          <label>
            Precio mínimo: 
            <input 
              type="number" 
              value={filters.minPrice} 
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              className="filter-input"
            />
          </label>
          <label>
            Precio máximo: 
            <input 
              type="number" 
              value={filters.maxPrice} 
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="filter-input"
            />
          </label>
          <label>
            Cantidad mínima:
            <input
              type="number"
              value={filters.minQuantity}
              onChange={(e) =>
                setFilters({ ...filters, minQuantity: Number(e.target.value) })
              }
              className="filter-input"
            />
          </label>
          <label>
            Cantidad máxima:
            <input
              type="number"
              value={filters.maxQuantity}
              onChange={(e) =>
                setFilters({ ...filters, maxQuantity: Number(e.target.value) })
              }
              className="filter-input"
            />
          </label>
          <button onClick={() => setFilters({
            available: false,
            minPrice: 0,
            maxPrice: Infinity,
            minQuantity: 0,
            maxQuantity: Infinity,
          })} className="clear-filters-button">
            Limpiar filtros
          </button>
        </div>
        <div className="sort-container">
          <label>
            Ordenar por:
            <select
              value={sort || ""}
              onChange={(e) => setSort(e.target.value as "price" | "quantity" | "available" | null)}
              className="sort-select"
            >
              <option value="">Seleccionar...</option>
              <option value="price">Precio</option>
              <option value="quantity">Cantidad</option>
              <option value="available">Disponibilidad</option>
            </select>
          </label>
          <button onClick={() => setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))} className="sort-direction-button">
            Dirección: {sortDirection === "asc" ? "Ascendente" : "Descendente"}
          </button>
        </div>
        
        {category && <p>Categoria seleccionada: {category.name}</p>}
        <div className="product-grid">
          {sortedMatches.map((product) => {
            const item = cart.get(product.id);
            return (
              <div key={product.id} className="product-card"> 
                <div>{product.name} (${product.price})</div>
                <div className="quantity-controls">
                  <button disabled={!item} onClick={() => handleDecrement(product)} className="decrement-button">-</button> 
                  {item?.quantity || 0} 
                  <button onClick={() => handleIncrement(product)} className="increment-button">+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;