import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowUpDown, CheckCircle, Filter, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCart, Product } from '../hooks/use-cart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wood Chair",
    price: 199.99,
    description: "Handcrafted wooden chair with premium finish",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    featured: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Modern Desk",
    price: 349.99,
    description: "Sleek modern desk for your workspace",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    rating: 4.2
  },
  {
    id: 3,
    name: "Contemporary Sofa",
    price: 899.99,
    description: "Elegant contemporary sofa for your living room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    featured: true,
    rating: 4.8
  },
  {
    id: 4,
    name: "Minimalist Lamp",
    price: 89.99,
    description: "Stylish minimalist lamp for your home or office",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Lighting",
    rating: 4.0
  },
  {
    id: 5,
    name: "Decorative Vase",
    price: 59.99,
    description: "Beautiful decorative vase for your home",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Decor",
    rating: 4.3
  },
  {
    id: 6,
    name: "Wall Art Print",
    price: 129.99,
    description: "Contemporary wall art to enhance your space",
    image: "https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Decor",
    featured: true,
    rating: 4.7
  }
];

const StorePage: React.FC = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchTerm) list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category));
    if (priceRange.min) list = list.filter(p => p.price >= parseFloat(priceRange.min));
    if (priceRange.max) list = list.filter(p => p.price <= parseFloat(priceRange.max));
    if (onlyFeatured) list = list.filter(p => p.featured);
    if (sortBy) {
      list.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
          default: return 0;
        }
      });
    }
    return list;
  }, [searchTerm, selectedCategories, priceRange, onlyFeatured, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">Shop Furniture & Decor</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center mt-2 mb-20">
          Discover a curated selection of premium furniture, elegant lighting, and stylish home decor designed to elevate your living space.
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filters</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                {/* Optional filter UI can be added here */}
              </PopoverContent>
            </Popover>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card
              key={product.id}
              className={`group relative flex flex-col h-full rounded-2xl overflow-hidden transition-shadow duration-300 shadow-sm hover:shadow-lg ${product.featured
                ? 'bg-primary/5 border border-primary/30 ring-1 ring-primary/20'
                : 'bg-white border border-gray-200 dark:border-gray-700'
                } dark:bg-gray-900`}
            >
              <div className="relative overflow-hidden h-48">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white shadow-md rounded-full px-3 py-1 text-xs font-semibold">
                        Featured
                      </Badge>
                    </div>
                  )}
                </Link>
              </div>
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg font-semibold truncate text-gray-800 dark:text-white hover:text-primary">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-2 flex-grow text-sm text-gray-600 dark:text-gray-300">
                <p className="line-clamp-2">{product.description}</p>
                <p className="mt-2 font-bold text-lg text-primary">${product.price.toFixed(2)}</p>
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : i < product.rating
                            ? 'text-yellow-200'
                            : 'text-gray-300 dark:text-gray-600'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({product.rating})</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-2">
                <Button
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold rounded-md bg-primary hover:bg-primary/90 transition-colors duration-200"
                  onClick={() => addItem(product)}
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;