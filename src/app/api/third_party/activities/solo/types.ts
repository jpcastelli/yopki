export type Activity = {
  title: string;
  description: string;
  gps_coordinates: {
      latitude: number;
      longitude: number;
  };
  rating: number;
  reviews: number;
  address: string;
};

export type ActivityDetails = {
  local_results: Activity[];
};