import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export type CatalogOption = {
  id: number
  codigo: string
  descripcion: string
  activo?: boolean | null
}

type CustomSelectProps = {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: CatalogOption[]
  error?: string
}

export const CustomSelect = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  options,
  error,
}: CustomSelectProps) => {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.descripcion}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export default CustomSelect

