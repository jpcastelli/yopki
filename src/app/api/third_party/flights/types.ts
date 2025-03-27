export type Flight = {
    flights: {
      departure_airport: {
        name: string
        id: string
        time: string
      }
      arrival_airport: {
        name: string
        id: string
        time: string
      }
      duration: number
      airplane: string
      airline: string
      airline_logo: string
      travel_class: string
      flight_number: string
      extensions: string[]
      ticket_also_sold_by: string[]
      legroom: string
      overnight: boolean
      often_delayed_by_over_30_min: boolean
      plane_and_crew_by: string
    }[]
    layovers?: {
      duration: number
      name: string
      id: string
      overnight: boolean
    }[]
    total_duration: number
    carbon_emissions?: {
      this_flight: number
      typical_for_this_route: number
      difference_percent: number
    }
    price: number
    type: string
    airline_logo?: string
    extensions?: string[]
    departure_token?: string
    booking_token?: string
}

export type FlightResponse = {
    best_flights: Flight[]
    other_flights: Flight[]
}

export type YopkiOneTripFlightParams = {
    origin: string
    destination: string
    departureDate: string
    returnDate: string
    adults: Number
}

export type YopkiOneTripFlight = {
  departure_airport: {
    name: string
    id: string
    time: string
  }
  arrival_airport: {
    name: string
    id: string
    time: string
  }
  price: number
}

export interface OneTripFlightResponse {
    DepartureFlight: YopkiOneTripFlight
    ReturnFlight: YopkiOneTripFlight
}