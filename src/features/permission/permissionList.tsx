"use client";
import { getPermissions } from "@/api/permission";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import startCase from "lodash/startCase";
import { useEffect, useMemo, useState } from "react";

type PermissionDto = { id: string; name: string };
type Role = { id: string; name: string; permissions?: PermissionDto[] };

type Props = {
  role: Role;
  onSubmit?: (ids: string[]) => void;
};

export default function PermissionMatrixDynamic({ role, onSubmit }: Props) {
  /* ---------------------------------------------------------------------- */
  /* 1. Chargement of local state                                            */
  /* ---------------------------------------------------------------------- */
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (role.permissions) setSelected(role.permissions.map((p) => p.id));
  }, [role]);

  const { data } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissions({}), // <- send { data: PermissionDto[] }
  });
  const perms: PermissionDto[] = useMemo(() => data?.data ?? [], [data?.data]);

  /* ---------------------------------------------------------------------- */
  /* 2. Construction of contexts / dynamic actions                         */
  /* ---------------------------------------------------------------------- */
  const { contexts, actions, grid } = useMemo(() => {
    /**
     * grid = { CONTEXT: { ACTION: PermissionDto } }
     * contexts / actions = sorted arrays.
     */
    const g: Record<string, Record<string, PermissionDto>> = {};
    const ctxSet = new Set<string>();
    const actSet = new Set<string>();

    perms.forEach((p) => {
      const [ctx, ...actParts] = p.name.split("_");
      const act = actParts.join("_"); // handles CREATE or COUNT_PIECE ...
      ctxSet.add(ctx);
      actSet.add(act);
      g[ctx] ??= {};
      g[ctx][act] = p;
    });

    return {
      contexts: Array.from(ctxSet).sort(),
      actions: Array.from(actSet).sort(),
      grid: g,
    };
  }, [perms]);

  /* ---------------------------------------------------------------------- */
  /* 3. Helpers                                                              */
  /* ---------------------------------------------------------------------- */
  const toggle = (permId: string, checked: boolean) =>
    setSelected((prev) =>
      checked ? [...prev, permId] : prev.filter((id) => id !== permId)
    );

  const isChecked = (permId?: string) =>
    permId ? selected.includes(permId) : false;

  const label = (str: string) =>
    startCase(str.toLowerCase()) // "COUNT_PIECE" -> "Count Piece"
      .replace(/Count Piece/i, "Compter les pièces") // small exceptions
      .replace(/Stock Stat/i, "Stat Stock")
      .replace(/Movement Stat/i, "Stat Mouvement");

  /* ---------------------------------------------------------------------- */
  /* 4. Render                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="w-full">
      <div className="flex justify-between p-3 pl-8">
        <h2 className="text-lg">Permissions</h2>
        <Button onClick={() => onSubmit?.(selected)}>Enregistrer</Button>
      </div>

      <div className="border overflow-auto max-h-[calc(100vh-10rem)]">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              <th className="px-4 py-3 w-40">Contexte</th>
              {actions.map((a) => (
                <th key={a} className="px-4 py-3 text-center">
                  {label(a)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contexts.map((ctx) => (
              <tr key={ctx} className="border-t">
                <td className="px-4 py-4 font-medium">{label(ctx)}</td>

                {actions.map((act) => {
                  const perm = grid[ctx]?.[act]; // undefined if non-existent
                  return (
                    <td key={act} className="px-4 py-4 text-center">
                      {perm ? (
                        <Checkbox
                          checked={isChecked(perm.id)}
                          onCheckedChange={(c) => toggle(perm.id, !!c)}
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
