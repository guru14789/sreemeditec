
import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Product, Transaction } from "@/types/product";
import { 
  Package, Eye, CreditCard, BarChart3, 
  DollarSign, FileEdit, Trash2, Plus 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    description: "High-quality noise-cancelling headphones with premium sound.",
    image: "/placeholder.svg",
    category: "Electronics",
    viewCount: 1245,
    purchaseCount: 68,
    lastUpdated: "2023-04-01",
    rating: 4.5
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 49.99,
    description: "Ergonomic wireless mouse with long battery life.",
    image: "/placeholder.svg",
    category: "Computer Accessories",
    viewCount: 876,
    purchaseCount: 123,
    lastUpdated: "2023-03-15",
    rating: 4.2
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 299.99,
    description: "Feature-rich smartwatch with fitness tracking capabilities.",
    image: "/placeholder.svg",
    category: "Wearables",
    viewCount: 2341,
    purchaseCount: 97,
    lastUpdated: "2023-04-05",
    rating: 4.7
  }
];

const sampleTransactions: Transaction[] = [
  { id: 1, productId: 1, quantity: 2, total: 399.98, date: "2023-04-06", status: "completed" },
  { id: 2, productId: 3, quantity: 1, total: 299.99, date: "2023-04-05", status: "completed" },
  { id: 3, productId: 2, quantity: 3, total: 149.97, date: "2023-04-04", status: "pending" },
  { id: 4, productId: 1, quantity: 1, total: 199.99, date: "2023-04-03", status: "cancelled" }
];

const AdminPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    image: "/placeholder.svg",
    category: "Electronics"
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      ...newProduct,
      id: products.length + 1,
      viewCount: 0,
      purchaseCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      rating: 0
    } as Product;
    
    setProducts([...products, product]);
    
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      image: "/placeholder.svg",
      category: "Electronics"
    });
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct({
      ...newProduct,
      category: value
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the catalog.",
    });
  };

  const totalViews = products.reduce((sum, product) => sum + (product.viewCount || 0), 0);
  const totalPurchases = products.reduce((sum, product) => sum + (product.purchaseCount || 0), 0);
  const totalRevenue = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, transaction) => sum + transaction.total, 0);
    
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold">{totalViews}</h3>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Purchases</p>
                <h3 className="text-2xl font-bold">{totalPurchases}</h3>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add New Product</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Manage your product catalog and view analytics for each product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="p-2 font-medium">Product</th>
                      <th className="p-2 font-medium">Price</th>
                      <th className="p-2 font-medium">Category</th>
                      <th className="p-2 font-medium">Views</th>
                      <th className="p-2 font-medium">Purchases</th>
                      <th className="p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md border bg-muted">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">${product.price.toFixed(2)}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="p-2">{product.viewCount}</td>
                        <td className="p-2">{product.purchaseCount}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-product">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Enter product details to add to your store catalog.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAddProduct}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newProduct.category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Computer Accessories">Computer Accessories</SelectItem>
                      <SelectItem value="Wearables">Wearables</SelectItem>
                      <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                      <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL or upload"
                  />
                  <p className="text-sm text-muted-foreground">
                    You can use placeholder.svg for testing.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and manage your store transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="p-2 font-medium">ID</th>
                      <th className="p-2 font-medium">Product</th>
                      <th className="p-2 font-medium">Quantity</th>
                      <th className="p-2 font-medium">Total</th>
                      <th className="p-2 font-medium">Date</th>
                      <th className="p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const product = products.find(p => p.id === transaction.productId);
                      return (
                        <tr key={transaction.id} className="border-t">
                          <td className="p-2">#{transaction.id}</td>
                          <td className="p-2">{product?.name || "Unknown Product"}</td>
                          <td className="p-2">{transaction.quantity}</td>
                          <td className="p-2">${transaction.total.toFixed(2)}</td>
                          <td className="p-2">{transaction.date}</td>
                          <td className="p-2">
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
