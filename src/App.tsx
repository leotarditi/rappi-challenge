import { useMemo, useState } from "react";
import { categories } from "./data/categories.json"
import { products } from "./data/products.json"

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

function MenuItem({category, onClick}: MenuItemProps) {
  const [isCollapsed, collapse] = useState(false);

  function handleCollapse(event: React.MouseEvent) {
    event.stopPropagation();

    if(isCollapsed) {
      onClick(null)
    }
    collapse((isCollapsed) => !isCollapsed)
  }

  return (
    <li key={category.id}>
      <div onClick={() => onClick(category)}>
        <span>{category.name}</span>
        {category.sublevels && 
          <button onClick={handleCollapse}>
            {isCollapsed ? 'x' : '+'}
          </button>}
      </div>
      {category.sublevels && isCollapsed && <Menu onCategoryClick={onClick} categories={category.sublevels} />}
    </li>
  )
}

function Menu({categories, onCategoryClick}: MenuProps) {
  return (
    <ol>
      {categories.map((category) => (
        <MenuItem onClick={onCategoryClick} key={category.id} category={category} />
      ))}
    </ol>
  )
}

function App() {
  const [category, setCategory] = useState<Category | null>(null)
  const [cart, setCart] = useState<Map<Product['id'], CartItem>>(() => new Map<Product['id'], CartItem>())
  
  const [filters, setFilters] = useState({
    available: false, // Inicialmente desactivado
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
          ? Number(b[sort]) - Number(a[sort]) // Disponibilidad (true > false)
          : a[sort] - b[sort]; // Precio o cantidad
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return sorted;
  }, [matches, sort, sortDirection]);  

  function handleDecrement(product: Product) {
    const draft = structuredClone(cart)
    const item = draft.get(product.id)

    if(item) {
      if(item.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        draft.delete(product.id)
      }
    }

    setCart(draft)
  }

  function handleIncrement(product: Product) {
    const draft = structuredClone(cart)
    const item = draft.get(product.id)

    if(!item) {
      draft.set(product.id, {
        quantity: 1,
        product
      })
    } else {
      item.quantity = item.quantity + 1;
    }

    setCart(draft)
  }

  return (
    <div>
      <div>
        <label>
          Buscar:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
          />
        </label>
      </div>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={filters.available}
            onChange={() => setFilters({ ...filters, available: !filters.available })}
          /> Solo disponibles
        </label>
        <label>
          Precio mínimo: 
          <input 
            type="number" 
            value={filters.minPrice} 
            onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
          />
        </label>
        <label>
          Precio máximo: 
          <input 
            type="number" 
            value={filters.maxPrice} 
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
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
          />
        </label>
      </div>
      <div>
        <h3>Filtros aplicados:</h3>
        <ul>
          {filters.available && <li>Solo disponibles</li>}
          {filters.minPrice > 0 && <li>Precio mínimo: ${filters.minPrice}</li>}
          {filters.maxPrice < Infinity && <li>Precio máximo: ${filters.maxPrice}</li>}
          {filters.minQuantity > 0 && <li>Cantidad mínima: {filters.minQuantity}</li>}
          {filters.maxQuantity < Infinity && <li>Cantidad máxima: {filters.maxQuantity}</li>}
        </ul>
      </div>
      <button onClick={() => setFilters({
        available: false,
        minPrice: 0,
        maxPrice: Infinity,
        minQuantity: 0,
        maxQuantity: Infinity,
      })}>
        Limpiar filtros
      </button>
      <div>
        <label>
          Ordenar por:
          <select
            value={sort || ""}
            onChange={(e) => setSort(e.target.value as "price" | "quantity" | "available" | null)}
          >
            <option value="">Seleccionar...</option>
            <option value="price">Precio</option>
            <option value="quantity">Cantidad</option>
            <option value="available">Disponibilidad</option>
          </select>
        </label>
        <button onClick={() => setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))}>
          Dirección: {sortDirection === "asc" ? "Ascendente" : "Descendente"}
        </button>
      </div>
      <Menu onCategoryClick={(category) => setCategory(category)} categories={categories} />
      {category && <p>Categoria seleccionada: {category.name}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12}}>
        {sortedMatches.map((product) => {
          const item = cart.get(product.id)
          return (
            <div key={product.id} style={{border: '1px solid white'}}> 
              {product.name} (${product.price})
              <div>
                <button disabled={!item} onClick={() => handleDecrement(product)}>-</button> 
                {item?.quantity || 0} 
                <button onClick={() => handleIncrement(product)}>+</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
