import ColorCard from "@/Components/ColorCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index() {
  const sampleColors = ["#ace", "#f2c", "#2ec", "#9c2", "#ff8", "#2ff"];

  return (
    <AuthenticatedLayout>
      <Head title="Colors" />

      <div className="grid grid-cols-1 sm:w-[90%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10 justify-items-stretch w-[85%] mx-auto">
        {sampleColors.map((color) => (
          <ColorCard key={color} color={color} />
        ))}
        <ColorCard color="#aceece" />
      </div>
    </AuthenticatedLayout>
  );
}
