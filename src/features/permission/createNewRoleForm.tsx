"use client";
import { createRole, roleDTO } from "@/api/permission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function CreateNewRoleForm() {
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState<string>("");

  const mutation = useMutation({
    mutationKey: ["create-role"],
    mutationFn: (newRole: roleDTO) => createRole(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return (
    <form
      onSubmit={() => mutation.mutate({ name: newRole })}
      className="space-y-4"
    >
      <Input
        placeholder="Ex : ADMIN"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
      />
      {mutation.isError ? (
        <span className="text-sm text-destructive">
          {`une erreur s'est produite`}
        </span>
      ) : (
        <></>
      )}
      <div className="flex w-full items-center justify-end">
        <Button disabled={mutation.isPending}>Valider</Button>
      </div>
    </form>
  );
}

export default CreateNewRoleForm;
