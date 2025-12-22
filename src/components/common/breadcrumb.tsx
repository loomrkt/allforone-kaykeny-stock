"use client";
import { useParams } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb as DefaultBreadcrumb,
} from "../ui/breadcrumb";

export interface BreadcrumbProps {
  label: string;
  path: string;
}

function Breadcrumb({ links }: { links: BreadcrumbProps[] }) {
  const params = useParams();
  return (
    <DefaultBreadcrumb>
      <BreadcrumbList>
        {links.map(({ label, path }, index) => (
          <div key={index} className="flex gap-1 items-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-neutral-600 hover:text-primary"
                href={`/${params.locale}/${path}`}
              >
                {label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== links.length ? <BreadcrumbSeparator /> : null}
          </div>
        ))}
      </BreadcrumbList>
    </DefaultBreadcrumb>
  );
}

export default Breadcrumb;
