import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Todos() {
  return (
    <AuthenticatedLayout>
      <Head title="Todos" />
    </AuthenticatedLayout>
  );
}
