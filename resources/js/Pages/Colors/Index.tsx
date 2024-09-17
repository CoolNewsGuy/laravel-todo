import ColorCard from "@/Components/ColorCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Color, PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEffect } from "react";

export default function Index({
  colors = [],
  auth,
}: PageProps<{ colors: Color[] }>) {
  useEffect(() => {
    if (!auth.user.has_added_color) {
      router.post("/add-sample-colors");
    }
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Colors" />

      <div className="grid grid-cols-1 sm:w-[90%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10 justify-items-stretch w-[85%] mx-auto">
        {colors.map((color) => (
          <ColorCard key={color.id} color={color.color} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
