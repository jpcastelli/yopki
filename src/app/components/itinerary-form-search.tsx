/* eslint-disable */
"use client";

import { useState } from "react";
import { TextField, Stack, ListItem, Button } from "@mui/material";

export default function ItineraryFormSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [loading, setLoading] = useState(false);

  interface Itinerary {
    flights: {
        DepartureFlight: 
          {
              arrival_airport: { name: string; id: string; time: string; };
              departure_airport: { name: string; id: string; time: string; };
              price: number;
      };
      ReturnFlight: 
          {
              arrival_airport: { name: string; id: string; time: string; };
              departure_airport: { name: string; id: string; time: string; };
              price: number;
      };
    },
    coffees: {
      neighborhood: string;
      shops: {
        title: string;
        address: string;
        rating: number;
        website: string;
      }[];
    }[];
    "solo-activities": {
      title: string;
      description: string;
      rating: number;
      address: string;
    }[];
  }
  

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const generateItinerary = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!origin || !destination || !departureDate || !returnDate || !travelers) {
      alert("Please fill in all fields");
      return;
    }
    if (new Date(departureDate) > new Date(returnDate)) {
      alert("Start date must be before end date");
      return;
    }
    if (parseInt(travelers) <= 0) {
      alert("Number of travelers must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/itinerary?origin=${origin}&destination=${destination}&departure_date=${departureDate}&return_date=${returnDate}&travelers=${travelers}`);
      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }
      const data = await response.json();
     
      setItinerary(data.itinerary);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      alert("Error fetching itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", textAlign: "center" }}>
      <h2>Itinerary Planner</h2>
      <p>Fill in the details below to generate your itinerary.</p>
      <form onSubmit={generateItinerary}>
        <Stack spacing={1} direction="column" sx={{ width: 600, margin: "auto" }}>
          <ListItem><TextField value={origin} onChange={(e) => setOrigin(e.target.value)} required label="Origin" variant="outlined" fullWidth /></ListItem>
          <ListItem><TextField value={destination} onChange={(e) => setDestination(e.target.value)} required label="Destination" variant="outlined" fullWidth /></ListItem>
          <ListItem><TextField type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required label="Departure Date" variant="outlined" fullWidth /></ListItem>
          <ListItem><TextField type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required label="Return Date" variant="outlined" fullWidth /></ListItem>
          <ListItem><TextField value={travelers} onChange={(e) => setTravelers(e.target.value)} required label="Travelers" variant="outlined" fullWidth /></ListItem>
          <Button type="submit" variant="outlined">{loading ? "Generating..." : "Generate Itinerary"}</Button>
        </Stack>
      </form>
        
    {itinerary && (

        <div style={{ marginTop: "20px", width: "100%", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", textAlign: "left" }}>
          <h2>Itinerary Details</h2>

          <h3>Your Flights</h3>
          <Stack spacing={2} direction="column" sx={{ width: 400, margin: "auto" }} textAlign={"left"}>
          <h4>Departure Flight</h4>
            <div>Airport: {itinerary.flights.DepartureFlight.departure_airport?.name} - {itinerary.flights.DepartureFlight.departure_airport.id}</div>
            <div>Time: {itinerary.flights.DepartureFlight.departure_airport.time}</div>
            <div>Arrival Airport: {itinerary.flights.DepartureFlight.arrival_airport.name} - {itinerary.flights.DepartureFlight.arrival_airport.id}</div>
            <div>Arrival Time: {itinerary.flights.DepartureFlight.arrival_airport.time}</div>
            <div>Price: ${itinerary.flights.DepartureFlight.price}</div>
            <h4>Return Flight</h4>
            <div>Airport: {itinerary.flights.ReturnFlight.departure_airport?.name} - {itinerary.flights.ReturnFlight.departure_airport.id}</div>
            <div>Time: {itinerary.flights.ReturnFlight.departure_airport.time}</div>
            <div>Arrival Airport: {itinerary.flights.ReturnFlight.arrival_airport.name} - {itinerary.flights.ReturnFlight.arrival_airport.id}</div>
            <div>Arrival Time: {itinerary.flights.ReturnFlight.arrival_airport.time}</div>
            <div>Price: ${itinerary.flights.ReturnFlight.price}</div>
            <div>Total Price: ${itinerary.flights.DepartureFlight.price + itinerary.flights.ReturnFlight.price}</div>
          </Stack>

          <h3>Coffee Shops</h3>
          <Stack spacing={2} direction="column" sx={{ width: 400, margin: "auto" }} textAlign={"left"}>
          {itinerary.coffees.map((shops: any, index: number) => (
            <div key={index}>
              <h4>{shops.neighborhood} Neigborhood</h4>
              
                {shops.shops.map((shop: any, i: number) => (
                  <Stack spacing={2} direction="column" sx={{ width: 400, margin: "auto" }} textAlign={"left"}>
                    <div><strong>{shop.title}</strong> - {shop.address} (⭐ {shop.rating})</div>
                    <div><a href={shop.website} target="_blank" rel="noopener noreferrer"> Website</a></div>
                    </Stack>
                ))}
              
            </div>
          ))}
          </Stack>

          <h3>Solo Activities</h3>
          <Stack spacing={2} direction="column" sx={{ width: 400, margin: "auto" }} textAlign={"left"}>
          {<ul>
            {itinerary["solo-activities"].map((activity: any, i: number) => (
              <li key={i}>
                <strong>{activity.title}</strong> - {activity.address}
                <div> (⭐ {activity.rating})</div>
                <div>{activity.description}</div>
                <div>{activity.rating}</div>
              </li>
            ))}
          </ul>}
          </Stack>
        </div>
      )}
    </div>
  );
}
