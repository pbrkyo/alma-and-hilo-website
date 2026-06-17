import { AdminBar } from "@/components/admin/admin-bar"
import { AdminEditor } from "@/components/admin/editor"
import type { Producto } from "@/lib/products"

const VACIO: Producto = {
  slug: "",
  nombre: "",
  categoria: "Tops",
  gancho: "",
  descripcion: "",
  materiales: "",
  precioDesde: 0,
  elaboracion: "Se teje para vos en 7 a 10 días",
  imagenes: [],
  escena: undefined,
  alt: "",
  opciones: [],
  destacado: false,
}

export default function NuevoProducto() {
  return (
    <>
      <AdminBar title="Nuevo producto" backHref="/admin" />
      <AdminEditor producto={VACIO} isNew />
    </>
  )
}
