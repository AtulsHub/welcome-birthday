import { Suspense } from 'react';
import Site from '../components/Site';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Site />
    </Suspense>
  );
}
