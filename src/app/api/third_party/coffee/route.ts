import { NextResponse } from 'next/server';

type Neighborhood = {
    title: string;
    gps_coordinates: {
      latitude: number;
      longitude: number;
    }
};

type Shop = {
    title: string
    gps_coordinates: {
      latitude: number
      longitude: number
    }
    description: string
    rating: number
    reviews: number
    address: string
    website: string
    reviews_link: string
    photos_link: string
};

type CoffeeShops = {
  neighborhood: string;
  shops: Shop[];
}

async function getNeighborhoodsByCity(city: string, totalNeighborhoods = 2): Promise<string[]> {
  let neighborhoodsList: string[] = [];

  const url = `${process.env.SERPAPI_HOST}/search.json?engine=google_maps&q=neighborhoods+in+${city}&api_key=${process.env.SERPAPI_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed fetching neighborhoods: ${response.statusText}`);
    }

    const neighborhoodsResponse = await response.json();
    const neighborhoods: Neighborhood[] = neighborhoodsResponse.local_results;

    if (!Array.isArray(neighborhoods) || neighborhoods.length === 0) {
      return [];
    }

    for (let i = 0; i < Math.min(totalNeighborhoods, neighborhoods.length); i++) {
      neighborhoodsList[i] = neighborhoods[i].title;
    }
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return [];
  }

  return neighborhoodsList;
}

async function getCoffeeShopsByNeighborhood(neighborhood: string) {
    const url = `${process.env.SERPAPI_HOST}/search.json?engine=google_maps&q=coffee+shops+in+${neighborhood}&api_key=${process.env.SERPAPI_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const shop : Shop[] =[]

    const shops =  data.local_results.slice(0, 2).map((shop: Shop) => ({
        title: shop.title,
        gps_coordinates: {
          latitude: shop.gps_coordinates?.latitude ?? 0,
          longitude: shop.gps_coordinates?.longitude ?? 0,
        },
        description: shop.description || "No description available",
        rating: shop.rating ?? 0,
        reviews: shop.reviews ?? 0,
        address: shop.address || "No address available",
        website: shop.website || "No website available",
        reviews_link: shop.reviews_link || "No reviews link available",
        photos_link: shop.photos_link || "No photos link available",
    }));

    return shops;
  }


  export async function GET(req: Request) {
    let coffeeShops: CoffeeShops[] = [];
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination');

    if (!destination) {
        return NextResponse.json({ error: 'Missing destination' }, { status: 400 });
    }

    const neighborhoods = await getNeighborhoodsByCity(destination);
    if (!neighborhoods || neighborhoods.length === 0) {
        return NextResponse.json({ error: 'No neighborhoods found' }, { status: 404 });
    }

    const coffeeShopsData = await Promise.all(
        neighborhoods.map(async (neighborhood) => {
            const shops = await getCoffeeShopsByNeighborhood(neighborhood);
            return { neighborhood, shops };
        })
    );

    return NextResponse.json(coffeeShopsData);
}


