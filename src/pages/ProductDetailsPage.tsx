
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useCart, Product } from '../hooks/use-cart';
import { Card } from '../components/ui/card';
import Layout from '../components/layout/Layout';

// Temporary product data - in a real app, you would fetch this from an API
const products: Product[] = [
  {
    id: 1,
    name: "Premium Wood Chair",
    price: 199.99,
    description: "Handcrafted wooden chair with premium finish. Made from sustainable oak wood, this chair combines comfort with elegance. Perfect for dining rooms, offices, or as an accent piece in any space. The ergonomic design ensures comfortable seating for extended periods.",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    featured: true,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594224457860-23f571ca3304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ]
  },
  // ... keep existing code (other product definitions)
];

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Find the product based on the ID from the URL
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/store')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </div>
      </Layout>
    );
  }

  // Render stars for the rating
  const renderRatingStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Quote Request Sent",
      description: "We'll get back to you shortly with a custom quote.",
    });
    setName('');
    setEmail('');
    setMessage('');
  };

  // Check if product price is above $20,000
  const isPriceAboveThreshold = product.price >= 20000;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/store')} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border bg-white h-96">
              <img 
                src={product.images?.[selectedImageIndex] || product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedImageIndex(index)}
                    className={`cursor-pointer border rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                      selectedImageIndex === index ? 'border-primary ring-2 ring-primary' : ''
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {renderRatingStars(product.rating)}
                  </div>
                  <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isPriceAboveThreshold && (
                <Button 
                  onClick={handleAddToCart}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
              
              <Button 
                onClick={() => document.getElementById('quoteTab')?.click()}
                className="w-full md:w-auto"
                size="lg"
                variant={isPriceAboveThreshold ? "default" : "outline"}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Request Quote
              </Button>
              
              {isPriceAboveThreshold && (
                <p className="text-amber-600 font-medium text-sm mt-2">
                  This high-value item requires a quote. Please use the Quote Request form below.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for Description and Quote Request */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger id="quoteTab" value="quote">Request Custom Quote</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700">{product.description}</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>High-quality materials</li>
                  <li>Sustainable manufacturing process</li>
                  <li>Elegant design for modern spaces</li>
                  <li>Easy to maintain and clean</li>
                  <li>1-year warranty included</li>
                </ul>
              </Card>
            </TabsContent>
            <TabsContent value="quote" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Request a Custom Quote</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Need a custom version or bulk pricing? Fill out this form and our team will get back to you with a personalized quote.
                </p>
                
                <form onSubmit={handleQuoteRequest} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Tell us about your specific requirements..."
                    />
                  </div>
                  
                  <Button type="submit">
                    Submit Quote Request
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
