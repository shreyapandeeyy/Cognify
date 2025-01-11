import React from "react";
import { ChevronRight } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadcrumbWithDropdown({ path }: { path: string }) {
  const segments = path.split("/").filter((segment) => segment !== "");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => (
          <React.Fragment key={idx}>
            {idx !== 0 && (
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>{segment}</BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
