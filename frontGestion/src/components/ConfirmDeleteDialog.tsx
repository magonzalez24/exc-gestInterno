import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type ConfirmDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  description?: string
  onConfirm: (razonBaja?: string) => void
  showReasonInput?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
}

export const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
  itemName,
  description,
  onConfirm,
  showReasonInput = false,
  reasonLabel = "Razón de baja",
  reasonPlaceholder = "Indique el motivo de la baja (opcional)",
}: ConfirmDeleteDialogProps) => {
  const [razonBaja, setRazonBaja] = useState("")
  const resolvedDescription =
    description ??
    `Vas a eliminar el empleado ${itemName}. La fecha de baja se registrará con la fecha de hoy.`

  const handleOpenChange = (next: boolean) => {
    if (!next) setRazonBaja("")
    onOpenChange(next)
  }

  const handleConfirm = () => {
    onConfirm(showReasonInput ? razonBaja.trim() || undefined : undefined)
    setRazonBaja("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            {resolvedDescription}
          </DialogDescription>
        </DialogHeader>
        {showReasonInput && (
          <div className="space-y-2 py-2">
            <Label htmlFor="razon_baja">{reasonLabel}</Label>
            <Input
              id="razon_baja"
              value={razonBaja}
              onChange={(e) => setRazonBaja(e.target.value)}
              placeholder={reasonPlaceholder}
              className="w-full"
            />
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteDialog

