import { NextResponse, type NextRequest } from 'next/server'
import { FlightSchema } from '@/app/lib/validation'
import type { YopkiOneTripFlightParams, FlightResponse, OneTripFlightResponse, YopkiOneTripFlight } from '@/app/api/third_party/flights/types'

async function getOneTripFlights(flightParams: YopkiOneTripFlightParams): Promise<OneTripFlightResponse> {
    let departureToken: string | undefined;
    let oneTripFlight: OneTripFlightResponse = {
        DepartureFlight: {} as YopkiOneTripFlight,
        ReturnFlight: {} as YopkiOneTripFlight
    };

    const url = `${process.env.SERPAPI_HOST}/search.json?engine=google_flights&departure_id=${flightParams.origin}&arrival_id=${flightParams.destination}&gl=us&hl=en&currency=USD&type=1&outbound_date=${flightParams.departureDate}&return_date=${flightParams.returnDate}&adults=${flightParams.adults}&api_key=${process.env.SERPAPI_KEY}`;
    const response = await fetch(url);
    const flightResponse: FlightResponse = await response.json();

    if (flightResponse.best_flights?.length > 0) {
        oneTripFlight.DepartureFlight.arrival_airport = flightResponse.best_flights[0].flights[0].arrival_airport;
        oneTripFlight.DepartureFlight.departure_airport = flightResponse.best_flights[0].flights[0].departure_airport;
        oneTripFlight.DepartureFlight.price = flightResponse.best_flights[0].price;
        departureToken = flightResponse.best_flights[0].departure_token;
    }

    if (flightResponse.other_flights?.length > 0) {
        oneTripFlight.DepartureFlight.arrival_airport = flightResponse.other_flights[0].flights[0].arrival_airport;
        oneTripFlight.DepartureFlight.departure_airport = flightResponse.other_flights[0].flights[0].departure_airport;
        oneTripFlight.DepartureFlight.price = flightResponse.other_flights[0].price;
        departureToken = flightResponse.other_flights[0].departure_token;
    }

    const departureUrl = `${process.env.SERPAPI_HOST}/search.json?engine=google_flights&departure_id=${flightParams.origin}&arrival_id=${flightParams.destination}&gl=us&hl=en&currency=USD&type=1&outbound_date=${flightParams.departureDate}&return_date=${flightParams.returnDate}&adults=${flightParams.adults}&departure_token=${departureToken}&api_key=${process.env.SERPAPI_KEY}`;

    try {
        const response = await fetch(departureUrl);
        const flightData: FlightResponse = await response.json();

        if (flightData.best_flights?.length > 0) {
            oneTripFlight.ReturnFlight.arrival_airport = flightData.best_flights[0].flights[0].arrival_airport;
            oneTripFlight.ReturnFlight.departure_airport = flightData.best_flights[0].flights[0].departure_airport;
            oneTripFlight.ReturnFlight.price = flightData.best_flights[0].price;
        }

        return oneTripFlight;
    } catch (error) {
        console.error("Error fetching return flights:", error);
        throw new Error('Failed to fetch return flights');
    }
}

async function getAirportCodesByOriginAndDestination(origin: string, destination: string): Promise<string[]> {
    const response = await fetch(`${process.env.OPENAI_HOST}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that provides airport codes for cities.`,
                },
                {
                    role: "user",
                    content: `What are the main airport codes for ${origin} and ${destination}? Provide only two IATA codes, separated by commas.`,
                },
            ],
        }),
    });

    const data = await response.json();
    const airports = data.choices[0]?.message?.content?.split(",").map(code => code.trim()) || [];

    return airports;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const flightParams: YopkiOneTripFlightParams = {
        origin: searchParams.get('origin')?.toUpperCase() ?? '',
        destination: searchParams.get('destination')?.toUpperCase() ?? '',
        departureDate: searchParams.get('departure_date') ?? '',
        returnDate: searchParams.get('return_date') ?? '',
        adults: parseInt(searchParams.get('adults') ?? '1')
    };

    const validation = FlightSchema.safeParse(flightParams);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    try {
        const airportCodes = await getAirportCodesByOriginAndDestination(flightParams.origin, flightParams.destination);
        if (airportCodes.length !== 2) {
            return NextResponse.json({ error: 'Invalid airport codes' }, { status: 400 });
        }
        flightParams.origin = airportCodes[0];
        flightParams.destination = airportCodes[1];
        console.log("Flight Params:", flightParams);

        const oneTripResponse = await getOneTripFlights(flightParams);

        return NextResponse.json(oneTripResponse);
    } catch (error) {
        console.error("Error fetching flights:", error);
        return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
    }
}
