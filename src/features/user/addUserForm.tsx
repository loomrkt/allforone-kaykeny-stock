"use client";

import { getDepots } from "@/api/depot";
import { getRoles } from "@/api/role";
import { createUser, updateUser, UpdateUserDTO, UserDTO } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/interfaces/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const userSchema = z
  .object({
    lastName: z.string().optional(),
    firstName: z.string().min(1, "Le prénom est requis"),
    email: z.string().min(1, "L'email est requis").email("Email invalide"),
    password: z.string().optional(),
    roleId: z.string().min(1, "Le rôle est requis"),
    depotId: z.string().min(1, "Le dépôt est requis"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        !data.currentPassword &&
        !data.newPassword &&
        !data.confirmNewPassword
      )
        return true;
      return (
        !!data.currentPassword &&
        !!data.newPassword &&
        !!data.confirmNewPassword &&
        data.newPassword === data.confirmNewPassword
      );
    },
    {
      message:
        "Les nouveaux mots de passe ne correspondent pas ou sont incomplets",
      path: ["confirmNewPassword"],
    }
  );

type UserFormData = z.infer<typeof userSchema>;

interface CreateUpdateUserFormProps {
  onCancel?: () => void;
  defaultValues?: User;
  currentUserId?: string;
}

export default function CreateUpdateUserForm({
  onCancel,
  defaultValues,
}: // currentUserId,
CreateUpdateUserFormProps) {
  const toastUtils = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  // const [openModal, setOpenModal] = useState(false);

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles({}),
  });

  const { data: depots = [] } = useQuery({
    queryKey: ["depots"],
    queryFn: () => getDepots({}),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      lastName: defaultValues?.lastName || "",
      firstName: defaultValues?.firstName || "",
      email: defaultValues?.email || "",
      password: "",
      roleId: defaultValues?.roleId || "",
      depotId: defaultValues?.depotId || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (user: UserDTO) => {
      return defaultValues?.id
        ? updateUser(defaultValues.id, user as UpdateUserDTO)
        : createUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toastUtils.showToast({
        title: defaultValues
          ? "Utilisateur mis à jour avec succès"
          : "Utilisateur créé avec succès",
      });
      router.push("/user");
      if (onCancel) onCancel();
    },
    onError: () => {
      toastUtils.showToast({
        title: "Erreur lors de la soumission",
        variant: "destructive",
      });
    },
  });

  // const passwordMutation = useMutation({
  //   mutationFn: async ({
  //     currentPassword,
  //     newPassword,
  //     confirmNewPassword,
  //   }: {
  //     currentPassword: string;
  //     newPassword: string;
  //     confirmNewPassword: string;
  //   }) => {
  //     if (!defaultValues?.id) return;
  //     return updateUserPassword({
  //       currentPassword,
  //       newPassword,
  //       confirmNewPassword,
  //     });
  //   },
  //   onSuccess: () => {
  //     toastUtils.showToast({
  //       title: "Mot de passe mis à jour avec succès",
  //     });
  //     setOpenModal(false);
  //     form.resetField("currentPassword");
  //     form.resetField("newPassword");
  //     form.resetField("confirmNewPassword");
  //   },
  //   onError: () => {
  //     toastUtils.showToast({
  //       title: "Erreur lors de la mise à jour du mot de passe",
  //       variant: "destructive",
  //     });
  //   },
  // });

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data as UserDTO);
  });

  // const onPasswordSubmit = form.handleSubmit(async (data) => {
  //   if (data.currentPassword && data.newPassword && data.confirmNewPassword) {
  //     await passwordMutation.mutateAsync({
  //       currentPassword: data.currentPassword,
  //       newPassword: data.newPassword,
  //       confirmNewPassword: data.confirmNewPassword,
  //     });
  //   }
  // });

  // const isCurrentUser = defaultValues?.id && defaultValues.id === currentUserId;

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Prénom" className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom" className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    className="bg-white"
                    disabled={!!defaultValues?.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!defaultValues?.id && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Mot de passe"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <div onClick={(e) => e.stopPropagation()}>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {"data" in roles &&
                        roles.data.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="depotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dépôt</FormLabel>
                <div onClick={(e) => e.stopPropagation()}>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionnez un dépôt" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {"data" in depots &&
                        depots.data.map((depot) => (
                          <SelectItem key={depot.id} value={depot.id}>
                            {depot.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {isCurrentUser && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end"
            >
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    onClick={(e) => e.stopPropagation}
                    variant="outline"
                    className="mb-4"
                  >
                    Modifier le mot de passe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le mot de passe</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={onPasswordSubmit} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Mot de passe actuel"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Nouveau mot de passe"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Confirmer le nouveau mot de passe
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirmer"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Annuler
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={passwordMutation.isPending}
                        className="bg-primary hover:bg-primary/80 text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {passwordMutation.isPending
                          ? "Envoi en cours..."
                          : "Mettre à jour"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )} */}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/80 w-full text-white rounded-lg py-2 px-6"
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : defaultValues
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
