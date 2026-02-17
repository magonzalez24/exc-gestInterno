import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CustomInputProps = {
  id: string
  label: string
  required?: boolean
  requiredLabel?: string
  type?: React.HTMLInputTypeAttribute
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  hint?: string
} & Omit<React.ComponentProps<"input">, "id" | "value" | "onChange" | "type">

export function CustomInput({
  id,
  label,
  required,
  requiredLabel,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  className,
  ...inputProps
}: CustomInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && requiredLabel != null && (
          <span className="text-red-500"> {requiredLabel}</span>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        {...inputProps}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hint != null && hint !== "" && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
