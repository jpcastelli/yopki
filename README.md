# Yopki Travel Itinerary
This project is an application that based on certain parameters(origin, destination, departure/return dates) provides a basic itinerary on what to do in the desired destination including flights information.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Requirements to run locally

1. Configure the necessary environment variables
```bash
# Create an .env.local file adding these variable
SERPAPI_HOST=
OPENAI_HOST=
SERPAPI_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_BASE_URL=
```
2. Next step would be to setup the environment
```bash
# Use the Node version already set in .nvmrc
nvm use
# In case you are not using NVM, you can install the node version specified inside .nvmrc

# If there's no pnpm installed in your machine otherwise you can use npm
npm install -g pnpm@latest-10

# Install dependencies
pnpm i

# Run the development server
pnpm dev
# or
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Hitting the API
For better documentation and easier use feel free to install Postman https://www.postman.com/downloads/

Once installed you can import Yopki.postman_collection.json that resides inside the root folder to check all the available endpoints.

## Pending Improvements
- Use a cache method for quicker API responses also to prevent timeouts for long concurrent calls.
- Improve API services to abstract third party services(SERP API, OpenAI) by applying design patterns.