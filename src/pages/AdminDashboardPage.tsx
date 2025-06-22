
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, DollarSign, Eye, ShoppingCart, 
  ArrowUpRight, ArrowDownRight, LineChart, PieChart
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import RequireAuth from "@/components/auth/RequireAuth";
import { Product, Transaction } from "@/types/product";

// Sample data for demonstration
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
    rating: 4.2 
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
    rating: 4.2 
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 129.99,
    description: "Portable bluetooth speaker with enhanced bass.",
    image: "/placeholder.svg",
    category: "Electronics",
    viewCount: 1532,
    purchaseCount: 82,
    lastUpdated: "2023-03-25",
    rating: 4.2 
  },
  {
    id: 5,
    name: "Laptop Stand",
    price: 39.99,
    description: "Adjustable laptop stand for improved posture.",
    image: "/placeholder.svg",
    category: "Computer Accessories",
    viewCount: 654,
    purchaseCount: 47,
    lastUpdated: "2023-04-02",
    rating: 4.2 
  }
];

const sampleTransactions: Transaction[] = [
  { id: 1, productId: 1, quantity: 2, total: 399.98, date: "2023-04-06", status: "completed" },
  { id: 2, productId: 3, quantity: 1, total: 299.99, date: "2023-04-05", status: "completed" },
  { id: 3, productId: 2, quantity: 3, total: 149.97, date: "2023-04-04", status: "pending" },
  { id: 4, productId: 1, quantity: 1, total: 199.99, date: "2023-04-03", status: "completed" },
  { id: 5, productId: 4, quantity: 2, total: 259.98, date: "2023-04-02", status: "completed" },
  { id: 6, productId: 5, quantity: 1, total: 39.99, date: "2023-04-01", status: "completed" },
  { id: 7, productId: 2, quantity: 2, total: 99.98, date: "2023-03-31", status: "completed" },
  { id: 8, productId: 4, quantity: 1, total: 129.99, date: "2023-03-30", status: "completed" }
];

// Monthly data for trends
const monthlyData = [
  { name: 'Jan', sales: 1200, views: 4500, orders: 85 },
  { name: 'Feb', sales: 1800, views: 5200, orders: 120 },
  { name: 'Mar', sales: 2400, views: 6500, orders: 160 },
  { name: 'Apr', sales: 2100, views: 7800, orders: 140 },
  { name: 'May', sales: 2800, views: 8200, orders: 190 },
  { name: 'Jun', sales: 3200, views: 9100, orders: 210 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboardPage = () => {
  const [products] = useState<Product[]>(sampleProducts);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  
  // Calculate key metrics
  const totalViews = products.reduce((sum, product) => sum + (product.viewCount || 0), 0);
  const totalPurchases = products.reduce((sum, product) => sum + (product.purchaseCount || 0), 0);
  const totalRevenue = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, transaction) => sum + transaction.total, 0);
  const conversionRate = (totalPurchases / totalViews) * 100;
  
  // Get top products by views and purchases
  const topViewedProducts = [...products].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
  const topPurchasedProducts = [...products].sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0)).slice(0, 5);
  
  // Calculate category distribution
  const categoryData = products.reduce((acc: { name: string; value: number }[], product) => {
    const existingCategory = acc.find(cat => cat.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);
  
  // Calculate week-over-week growth
  const weeklyGrowth = 12.5; // Sample data, would be calculated from actual data
  const revenueGrowth = 8.3; // Sample data, would be calculated from actual data
  
  return (
    <RequireAuth>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
                  <h3 className="text-2xl font-bold">{totalViews.toLocaleString()}</h3>
                  <div className="flex items-center mt-1 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+5.2% WoW</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold">{totalPurchases.toLocaleString()}</h3>
                  <div className="flex items-center mt-1 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+{weeklyGrowth}% WoW</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Revenue</p>
                  <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                  <div className="flex items-center mt-1 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+{revenueGrowth}% WoW</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Conversion Rate</p>
                  <h3 className="text-2xl font-bold">{conversionRate.toFixed(1)}%</h3>
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>-0.8% WoW</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Monthly sales and views over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <RechartsLineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 6 }} name="Sales ($)" />
                    <Line type="monotone" dataKey="views" stroke="#00C49F" strokeWidth={2} name="Views" />
                  </RechartsLineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Product distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ChartContainer config={{}}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Products and Orders Analysis */}
        <Tabs defaultValue="top-products" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md">
            <TabsTrigger value="top-products">Top Products</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top-products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Viewed Products</CardTitle>
                  <CardDescription>Products with the highest view counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topViewedProducts.map((product) => (
                        <TableRow key={`view-${product.id}`}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.viewCount?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Best Selling Products</CardTitle>
                  <CardDescription>Products with the highest purchase counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPurchasedProducts.map((product) => (
                        <TableRow key={`purchase-${product.id}`}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.purchaseCount?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest transactions in your store</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((transaction) => {
                      const product = products.find(p => p.id === transaction.productId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">#{transaction.id}</TableCell>
                          <TableCell>{product?.name || "Unknown"}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="text-right">${transaction.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                                : transaction.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Orders</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Analysis</CardTitle>
                <CardDescription>Comparison of views vs. purchases for top products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <BarChart
                      data={topViewedProducts}
                      margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                        height={60}
                      />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="viewCount" fill="#8884d8" name="Views" />
                      <Bar dataKey="purchaseCount" fill="#82ca9d" name="Purchases" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="w-1/2 mr-2">Export Data</Button>
                <Button className="w-1/2 ml-2">Detailed Analysis</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Conversion Funnel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Customer journey from view to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium">Views</div>
                <div className="w-3/4 bg-muted rounded-sm h-4 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '100%' }}></div>
                </div>
                <div className="ml-4 min-w-[60px] text-right">{totalViews}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium">Add to Cart</div>
                <div className="w-3/4 bg-muted rounded-sm h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '42%' }}></div>
                </div>
                <div className="ml-4 min-w-[60px] text-right">{Math.round(totalViews * 0.42)}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium">Checkout Started</div>
                <div className="w-3/4 bg-muted rounded-sm h-4 overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: '18%' }}></div>
                </div>
                <div className="ml-4 min-w-[60px] text-right">{Math.round(totalViews * 0.18)}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium">Purchases</div>
                <div className="w-3/4 bg-muted rounded-sm h-4 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${conversionRate}%` }}></div>
                </div>
                <div className="ml-4 min-w-[60px] text-right">{totalPurchases}</div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Overall conversion rate: <span className="font-medium text-foreground">{conversionRate.toFixed(1)}%</span></p>
              <p>Average order value: <span className="font-medium text-foreground">${(totalRevenue / totalPurchases).toFixed(2)}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
};

export default AdminDashboardPage;
