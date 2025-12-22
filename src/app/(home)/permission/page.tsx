"use client";
import { addPermissionRole, getRoles } from "@/api/permission";
import PermissionsMatrix from "@/features/permission/permissionList";
import RoleList from "@/features/permission/roleList";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/interfaces/role&permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function PermissionPage() {
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles({}),
  });
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  const queryClient = useQueryClient();
  const toastUtils = useToast();

  const mutation = useMutation({
    mutationKey: ["update-role-permission"],
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => addPermissionRole({ roleId, permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toastUtils.showToast({
        title: "Modification réussie",
      });
    },
    onError: () => {
      toastUtils.showToast({
        title: "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (permissionIds: string[]) => {
    if (selectedRole?.id)
      mutation.mutate({ roleId: selectedRole?.id, permissionIds });
    else if (data?.data[0].id)
      mutation.mutate({ roleId: data?.data[0].id, permissionIds });
  };

  return (
    <div className="flex max-sm:w-[calc(100vw-60px)] h-[calc(100vh-8rem)] w-full max-sm:flex-col max-sm:overflow-y-auto">
      <RoleList className="w-1/5 max-sm:w-full" handleClick={setSelectedRole} />
      <div className="w-full">
        {selectedRole ? (
          <PermissionsMatrix role={selectedRole} onSubmit={handleSubmit} />
        ) : data?.data ? (
          <PermissionsMatrix role={data?.data[0]} onSubmit={handleSubmit} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default PermissionPage;
