"use client";

import { getUsers, updateUserPassword } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import NotificationPopover from "../notification/notificationPopover";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(1, "Le nouveau mot de passe est requis"),
    confirmNewPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

function Navbar() {
  const { data: session } = useSession();
  const [openPopover, setOpenPopover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const toastUtils = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({}),
    enabled: !!session?.user?.email,
  });

  const matchedUser = users?.data?.find(
    (user) => user.email === session?.user?.email
  );

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim().length > 0) {
      return name
        .split(" ")
        .filter((n) => n.trim().length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email && email.trim().length > 0) {
      return email.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      return updateUserPassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
    },
    onSuccess: () => {
      toastUtils.showToast({
        title: "Mot de passe mis à jour avec succès",
      });
      setOpenModal(false);
      form.reset();
    },
    onError: () => {
      toastUtils.showToast({
        title: "Erreur lors de la mise à jour du mot de passe",
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = form.handleSubmit(async (data) => {
    await passwordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  });

  const userEmail = session?.user?.email || "";
  const userName = matchedUser?.firstName
    ? `${matchedUser.firstName} ${matchedUser.lastName}`.trim()
    : matchedUser?.lastName || "";
  const displayName = userName || userEmail || "KayKeny";
  const initials = getInitials(userName, userEmail);

  return (
    <>
      <header
        className={cn(
          "fixed flex justify-end px-4 py-2 top-0 z-40 bg-white w-full border-b border-gray-200"
        )}
      >
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <NotificationPopover />
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold"
                    title={displayName}
                  >
                    {isLoading ? "..." : initials}
                  </div>
                  <span className="text-sm text-gray-700">
                    {isLoading ? "Chargement..." : displayName}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-semibold text-lg">
                      {isLoading ? "..." : initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {isLoading ? "Chargement..." : userName || "KayKeny"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userEmail || "Email non défini"}
                      </p>
                    </div>
                  </div>
                  <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Changer le mot de passe
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le mot de passe</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
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
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              className="rounded-full px-4 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => signOut()}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
