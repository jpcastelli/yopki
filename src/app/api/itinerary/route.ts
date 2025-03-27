import {NextResponse} from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departure_date');
    const returnDate = searchParams.get('return_date');

    if (!origin || !destination || !departureDate || !returnDate) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const [flights, coffeeShops, activities] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/third_party/flights?origin=${origin}&destination=${destination}&departure_date=${departureDate}&return_date=${returnDate}`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/third_party/coffee?destination=${destination}`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/third_party/activities/solo?destination=${destination}`).then(res => res.json()),
  ]);

  return NextResponse.json({
      itinerary: {
           "flights": flights,
           "coffees": coffeeShops,
           "solo-activities": activities
      }
  });
}