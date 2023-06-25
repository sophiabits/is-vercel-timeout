# is-vercel-timeout

Detecting when a serverless function has timed out on Vercel is usually straightforward, but some packages like [TRPC](https://trpc.io) insert their own error handling logic which can hide the original `fetch` error, making detection harder. This package exports functions suitable for detecting Vercel function timeouts in a variety of different contexts.

## Usage

```
$ pnpm add is-vercel-timeout
```

```ts
import { isTRPCVercelTimeout } from 'is-vercel-timeout';

import { trpc } from '@/utils/trpc';

export default function IndexPage() {
  const { data, isLoading } = trpc.getSomeData.useQuery({}, {
    // Retry timeouts up to five times
    retry: (failureCount, err) => failureCount <= 5 && isTRPCVercelTimeout(err),
  });

  // ...
}
```
