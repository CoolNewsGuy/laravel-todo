import ColorCard from "@/Components/ColorCard";
import NewColorForm from "@/Components/NewColorForm";
import { ActiveCardProvider } from "@/contexts/active-card-context";
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

      <div className="mt-10 flex justify-center">
        <NewColorForm />
      </div>

      <div className="mx-auto mt-10 grid w-[85%] grid-cols-1 justify-items-stretch gap-8 sm:w-[90%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ActiveCardProvider>
          {colors.map((color) => (
            <ColorCard key={color.id} color={color} />
          ))}
        </ActiveCardProvider>
      </div>
    </AuthenticatedLayout>
  );
}
