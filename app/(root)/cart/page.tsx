'use client';
import { ShoppingCart, Home, User, Package, Plus, Minus, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  cn,
  extractASIN
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import { getProduct, getProductDetails } from '@/lib/actions/getAction';

const formSchema = z.object({
  product_link: z.string().min(1)
});

  function MyForm({ onProductFetched }: { onProductFetched: (data: any) => void }) {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      const ASIN_CODE = extractASIN(values.product_link);
      console.log("Extracted ASIN:", ASIN_CODE);
      const productDetails =  await getProduct(ASIN_CODE!);
      console.log("Product Details:", productDetails);
onProductFetched(productDetails);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-full!'>
        <FormField

          control={form.control}
          name="product_link"
          render={({ field }) => (
            <FormItem className='w-full!'>
              <FormLabel className='text-slate-400'>Product URL</FormLabel>
              <FormControl>
                <Input 
                placeholder="https://www.amazon.com/dp/..."
                className=''
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='mt-6 ml-1'>Add to Cart</Button>
      </form>
    </Form>
  )
}

const SP3NDApp = () => {
  const [productPreview, setProductPreview] = useState<any>({
  timestamp: 1761463674,
  status: 'completed',
  feature_bullets: [
    'Package Contents: 3 wall Hexagaon painting',
    'Item Size: 17 inches X 17 inches',
    'Usage: It can be used for living room, home decor and for gifting purposes',
    'self addeshive multi-effect easy clean to dry cloth painting',
    'hexagon,7 horses,seven horses,nature,6MM MDF,PANEL PAINTING,panel painting,kids decore,motivational,motivation,kids room,cartoon,panel painting,panels,wall hanging,Ganesh,Ganesha,Ganesh Ji,Modern art ganesh,ganesh Painting,Buddha,Floral,Modern Art,Rajasthani Village Painting,Painting,Wall Painting,Wall decor,wall art,decals,wall decals,modern Art,abstract,led Paintings gift,gifts,photo frame,framing,uv,poster,wall Painting,kids room decor,decals,wall sticker,Radha Krishna,Radha,Krishna'
  ],
  title: 'SAF Preety Floral Flower and Leaf in Cone Pot 3 Piece UV Textured Multi-Effect Self adheshive Painting 17 Inch X 17 Inch SANFHX141,Multicolour',
  gift_card: false,
  aplus_html: 'present',
  html_product_description: '<div id="productDescription" class="a-section a-spacing-small">          <!-- show up to 2 reviews by default -->\n' +
    '                       <p>    <span>UV Multieffect Paintings has Pasted on a Base of 6MM MDF with Double side Foam Tape . After a long research and development we come up with this MDF Panel Paintings. It is long lasting and unbreakable. You can add a good set of lights to the place where the painting is which will give a fantastic sparkle look, and the decor will give a different feel and look to the place. Quality and Durability:- The painting has a UV finish and includes a good quality MDF on which painting is pasted with a dimension of 3 Panels is 43 CM X 43 CM. However, it does not include glass. Specifications</span>    </p>            </div>',
  product_description: 'UV Multieffect Paintings has Pasted on a Base of 6MM MDF with Double side Foam\n' +
    'Tape . After a long research and development we come up with this MDF Panel\n' +
    'Paintings. It is long lasting and unbreakable. You can add a good set of\n' +
    'lights to the place where the painting is which will give a fantastic sparkle\n' +
    'look, and the decor will give a different feel and look to the place. Quality\n' +
    'and Durability:- The painting has a UV finish and includes a good quality MDF\n' +
    'on which painting is pasted with a dimension of 3 Panels is 43 CM X 43 CM.\n' +
    'However, it does not include glass. Specifications',
  images: [
    'https://m.media-amazon.com/images/I/51FkEHDh0IL.jpg',
    'https://m.media-amazon.com/images/I/51FO4Qxe7IL.jpg',
    'https://m.media-amazon.com/images/I/61Iv+qbBdpL.jpg'
  ],
  main_image: 'https://m.media-amazon.com/images/I/51FkEHDh0IL.jpg',
  product_details: [
    'Product Dimensions: 16.93 x 16.93 x 0.79 inches',
    'Item Weight: 12.3 ounces',
    'Manufacturer: SAF',
    'Item model number: SAFHX141',
    'Date First Available: June 9, 2020'
  ],
  eliapo: false,
  brand: 'SAF',
  categories: [
    'Home & Kitchen',
    'Home Décor Products',
    'Home Décor Accents',
    'Sculptures',
    'Wall Sculptures'
  ],
  package_dimensions: {
    size: { width: [Object], depth: [Object], length: [Object] },
    weight: { amount: 0.7936641432, unit: 'pounds' }
  },
  all_variants: [ { product_id: 'B085Y5VGGK', variant_specifics: [] } ],
  return_hint: null,
  return_hint_text: '30-day refund/replacement',
  delight_text: '',
  tag_title: 'SAF Preety Floral Flower and Leaf in Cone Pot 3 Piece UV Textured Multi-Effect Self adheshive Painting 17 Inch X 17 Inch SANFHX141,Multicolour',
  variant_specifics: [],
  asin: 'B085Y5VGGK',
  product_id: 'B085Y5VGGK',
  retailer: 'amazon',
  stars: 4,
  review_count: 5722,
  question_count: null,
  num_offers: 2,
  fresh: false,
  pantry: false,
  handmade: false,
  customizable: false,
  digital: false,
  digital_subscription: false,
  buyapi_hint: true,
  parent_asin: null,
  blank_box: false,
  price: 3887,
  ship_price: 500,
  addon: false,
  epids: [ { type: 'MPN', value: 'SAFHX141' } ],
  epids_map: { MPN: 'SAFHX141' }
});

  const [currentPage, setCurrentPage] = useState('cart');
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    country: 'India',
    address: '',
    addressLine2: '',
    locality: '',
    city: '',
    pinCode: '',
    state: '',
    email: ''
  });

  const handleAddToCart = async () => {
    if (!productUrl) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        name: 'SAF Set of 3 Hexagon Preety Brown Floral UV Textured MDF...',
        price: 1.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80'
      };
      setCartItems([...cartItems, newItem]);
      setProductUrl('');
      setIsLoading(false);
    }, 1500);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };


  const CartPage = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Shop with crypto on the world's largest online marketplace
        </h1>
      </div>

      {/* <Alert className="mb-8">
        <AlertDescription>
          <div className="flex items-start gap-3">
            <span className="text-2xl">₹</span>
            <div>
              <div className="font-semibold mb-1">Indian Rupee Detected</div>
              <div className="text-sm">Products from India • Prices will be converted to USD</div>
              <div className="text-sm mt-1">
                🔒 Cart locked to amazon.in • Remove all items to shop from other stores
              </div>
              <div className="text-xs mt-2">
                <strong>Note:</strong> All prices will be automatically converted from INR to USD at checkout using current exchange rates.
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert> */}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]  lg:grid-rows- gap-8">
        <div className="">
          <Card className='gap-0!'>
            <CardHeader>
              <CardTitle>Add Amazon Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {/* <Input
                  placeholder="https://www.amazon.com/dp/..."
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                />
                <Button 
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Add to Cart'}
                </Button> */}
                <MyForm  onProductFetched={(data) => setProductPreview(data)} />
              </div>
            </CardContent>
          </Card>
          {productPreview && (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{productPreview.title}</CardTitle>
      <CardDescription>{productPreview.brand}</CardDescription>
    </CardHeader>

    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left side: Image */}
      <div className="flex justify-center items-center">
        <img
          src={productPreview.main_image}
          alt={productPreview.title}
          className="w-full max-w-[300px] rounded-xl shadow-md *:object-contain min-h-fit"
        />
      </div>

      {/* Right side: Info */}
      <div className="space-y-3">
        <p className="text-base text-gray-400 leading-relaxed line-clamp-4">
          {productPreview.product_description}
        </p>

        <div>
          <p className="font-semibold text-xl">₹{productPreview.price}</p>
          <p className="text-sm text-gray-100">Shipping: ₹{productPreview.ship_price}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-100 mb-1">Highlights:</h4>
          <ul className="list-disc list-inside text-sm text-gray-400">
            {productPreview.feature_bullets?.slice(0, 4).map((bullet: string, i: number) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* <Button className="mt-4 w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button> */}
      </div>
    </CardContent>
  </Card>
)}

        </div>

        <div className='min-w-full'>
          <Card className='min-w-full! flex-1!'>
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add Amazon products by pasting product URLs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-2">{item.name}</h4>
                        <p className="font-semibold">${item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Estimated Total</span>
                      <span>${calculateSubtotal().toFixed(2)}+</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => redirect('/checkout')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

 

  return (
      <CartPage /> 
  );
};

export default SP3NDApp;



