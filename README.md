# Geometry Dash VN SDK

## Installation
```bash
deno add jsr:@nampe286/geometry-dash-vn-sdk
```

## Usage
```ts
import { Client } from "jsr:@nampe286/geometry-dash-vn-sdk";

const SUPABASE_API_URL: string = "your-supabase-api-url";
const SUPABASE_API_KEY: string = "your-supabase-api-key";
const API_URL: string = "your-api-url";

const client = new Client(SUPABASE_API_URL, SUPABASE_API_KEY, API_URL);

console.log(await client.user.get("uuid"));
```