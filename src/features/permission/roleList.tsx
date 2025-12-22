"use client";
import { getRoles } from "@/api/role";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/interfaces/role&permission";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import CreateRoleButton from "./createRoleButton";

import DeleRoleButton from "./deleRoleButton";

const RoleItem = ({
  isSelected,
  role,
  handleClick,
}: {
  isSelected?: boolean;
  role: Role;
  handleClick: (role: Role) => void;
}) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-muted px-3 py-2 rounded-md",
        isSelected && "bg-accent"
      )}
    >
      <Button
        variant="ghost"
        className="justify-start text-left"
        onClick={() => handleClick(role)}
      >
        {role.name}
      </Button>
      <DeleRoleButton role={role} />
    </div>
  );
};

const LoadingRoleList = () => {
  return (
    <div
      className="flex flex-col space-y-3 max-w-96 overflow-y-scroll px-4"
      style={{ scrollbarWidth: "none" }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-10 rounded-sm" />
      ))}
    </div>
  );
};

function RoleList({
  className,
  handleClick,
}: {
  handleClick: (role: Role) => void;
  className?: string;
}) {
  const [searchParams, setSearchParams] = useState<string>("");
  const search = useDebounce(searchParams, 1000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles", search],
    queryFn: () => getRoles({ search }),
  });

  const [currentRole, setCurrentRole] = useState<string | undefined>(
    data?.data[0].id ?? undefined
  );

  useEffect(() => {
    if (data?.data) {
      setCurrentRole(data.data[0].id);
    }
  }, [data?.data]);

  return (
    <div className={cn("rounded-3xl space-y-4", className)}>
      <div className="flex bg-primary items-center justify-between text-white rounded-tr-3xl py-3 px-4">
        <h1 className="font-bold">Rôle</h1>
        <CreateRoleButton />
      </div>
      <SearchInput
        placeholder="Rechercher un rôle..."
        value={searchParams}
        onChange={(e) => setSearchParams(e.target.value)}
        onClear={() => {
          setSearchParams("");
        }}
        className="mx-4"
      />
      <div
        className="flex flex-col space-y-3 max-w-96 overflow-y-scroll px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {isLoading || isError ? <LoadingRoleList /> : <></>}
        {data?.data?.map((role) => (
          <RoleItem
            key={role.id}
            isSelected={role.id === currentRole}
            role={role}
            handleClick={() => {
              setCurrentRole(role.id);
              handleClick(role);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default RoleList;
