import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type PageBreadcrumbProps = {
  backHref: string
  backLabel: string
  title: string
}

export const PageBreadcrumb = ({ backHref, backLabel, title }: PageBreadcrumbProps) => {
  return (
    <div className="space-y-2">
      <Breadcrumb aria-label={title}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={backHref}>{backLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    </div>
  )
}

