import { Spinner } from "@/components/ui/spinner"

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-blue-600" />
        <p className="text-sm text-slate-600">Cargando...</p>
      </div>
    </div>
  )
}

export { LoadingScreen }
