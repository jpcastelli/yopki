import { NextResponse } from 'next/server';
import { Activity, ActivityDetails } from './types';

async function getActivitiesByDestination(destination: string, totalActivities = 3): Promise<string[]> {
    const openAiResponse = await fetch(`${process.env.OPENAI_HOST}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: `Suggest ${totalActivities} solo activities in ${destination}.` }],
        }),
    });

    const openAiData = await openAiResponse.json();
    const activities = openAiData.choices[0]?.message?.content?.split('\n') || [];
    const parsedActivities = activities.map(activity => activity.match(/\*\*([^*]+)\*\*/g))
        .flat()
        .filter(Boolean)
        .map(activity => activity.replace(/\*\*/g, ''));

    return parsedActivities;
}

async function getActivitiesDetailsByActivityAndDestination(destination: string, activities: string[]): Promise<Activity[]> {
    const parsedActivityDetails: ActivityDetails[] = [];
    let index = 0;
    await Promise.all(activities.map(async (activity) => {
        const url = `${process.env.SERPAPI_HOST}/search.json?engine=google_local&q=${activity}+in+${destination}&api_key=${process.env.SERPAPI_KEY}`;
        const res = await fetch(url);
        parsedActivityDetails[index] = await res.json();
        index++;
    }));

    const details: Activity[] = [];
    parsedActivityDetails.forEach(detail => { 
          if (detail.local_results.length > 0) {
          const activity = detail.local_results[0];
          details.push({
          title: activity.title,
          description: activity.description || "No description available",
          gps_coordinates: {
              latitude: activity.gps_coordinates?.latitude ?? 0,
              longitude: activity.gps_coordinates?.longitude ?? 0,
          },
          rating: activity.rating ?? 0,
          reviews: activity.reviews ?? 0,
          address: activity.address || "No address available",
          });
          }
      });

    return details;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination');

    if (!destination) {
        return NextResponse.json({ error: 'Missing destination' }, { status: 400 });
    }

    const activities = await getActivitiesByDestination(destination);
    if (!activities || activities.length === 0) {
        return NextResponse.json({ error: 'No activities found' }, { status: 404 });
    }

    const activityDetails = await getActivitiesDetailsByActivityAndDestination(destination, activities);
    if (!activityDetails || activityDetails.length === 0) {
        return NextResponse.json({ error: 'No activity details found' }, { status: 404 });
    }

    return NextResponse.json(activityDetails);
}
