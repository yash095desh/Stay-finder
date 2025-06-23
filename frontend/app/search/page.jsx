import SearchClient from "@/components/SearchClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // prevent static generation

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <SearchClient />
    </Suspense>
  );
}
