export type Neighborhood = {
  title: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  }
};

export type Shop = {
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

export type CoffeeShops = {
neighborhood: string;
shops: Shop[];
}