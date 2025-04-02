'use client';

import { useState, useCallback } from 'react';
import { Heart, Loader2, Search, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useInfiniteScroll } from 'src/hooks/use-infinite-scroll';
import placeholderImage from '@/assets/images/property-placeholder.svg';

// Types for our property data
type Property = {
  id: string;
  title: string;
  address: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
};

// Placeholder images to use when no images are available
const generateProperties = (startId: number, count: number): Property[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = (startId + index).toString();

    return {
      id,
      title: `Property ${id} - ${['Modern Apartment', 'Cozy Studio', 'Luxury Villa', 'Beach House', 'Mountain Cabin'][Math.floor(Math.random() * 5)]}`,
      address: `${['Seoul', 'Busan', 'Jeju Island', 'Incheon', 'Daegu'][Math.floor(Math.random() * 5)]}, South Korea`,
      images: [placeholderImage],
      price: Math.floor(Math.random() * 200) + 80,
      rating: (Math.random() * 0.5 + 4.5).toFixed(2) as unknown as number,
      reviewCount: Math.floor(Math.random() * 150) + 10,
      isFavorite: Math.random() > 0.8,
    };
  });
};

// Initial sample data
const sampleProperties: Property[] = generateProperties(1, 6);

const HomeContainer = () => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setProperties(
      properties.map((property) =>
        property.id === id ? { ...property, isFavorite: !property.isFavorite } : property
      )
    );
  };

  // Load more properties
  const loadMoreProperties = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const nextPage = page + 1;
      const newProperties = generateProperties(properties.length + 1, 6);

      setProperties((prev) => [...prev, ...newProperties]);
      setPage(nextPage);
      setIsLoading(false);

      // Stop after loading 5 pages (30 items) for demo purposes
      if (nextPage >= 5) {
        setHasMore(false);
      }
    }, 1000);
  }, [isLoading, page, properties.length, hasMore]);

  // Setup infinite scroll
  const { ref } = useInfiniteScroll<HTMLDivElement>(loadMoreProperties, {
    rootMargin: '200px',
  });

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find your next stay</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location or property name"
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} onToggleFavorite={toggleFavorite} />
        ))}
      </div>

      {/* No results message */}
      {searchQuery && filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No properties found</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn't find any properties matching "{searchQuery}"
          </p>
          <Button onClick={() => setSearchQuery('')} variant="outline">
            Clear search
          </Button>
        </div>
      )}

      {/* Loading indicator and sentinel element for infinite scroll */}
      <div ref={ref} className="flex justify-center items-center py-8 mt-4">
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading more properties...</span>
          </div>
        )}
        {!isLoading && !hasMore && filteredProperties.length > 0 && (
          <p className="text-muted-foreground">No more properties to load</p>
        )}
      </div>
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
}

function PropertyCard({ property, onToggleFavorite }: PropertyCardProps) {
  // Check if property has images
  const hasImages = property.images && property.images.length > 0;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {hasImages ? (
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <img
                      src={image || placeholderImage}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="relative aspect-square rounded-t-lg overflow-hidden">
            <img
              src={placeholderImage}
              alt={`${property.title} - Placeholder`}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => onToggleFavorite(property.id)}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              property.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            )}
          />
          <span className="sr-only">
            {property.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>{property.rating}</span>
            <span className="text-muted-foreground">({property.reviewCount})</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{property.address}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="font-semibold">${property.price}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default HomeContainer;
