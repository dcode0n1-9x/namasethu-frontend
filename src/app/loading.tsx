import { BrandLoader } from "@/components/ui/BrandLoader";

// Route-level loader: shown while a page segment (and its data) is loading.
export default function Loading() {
  return <BrandLoader variant="page" label="Loading" />;
}
