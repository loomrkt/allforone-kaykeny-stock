import { resetPassword } from "@/api/user/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function ChangePassword({ email, code }: { email: string; code: number[] }) {
  const router = useRouter();
  const params = useParams();
  const mutationResetPassword = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast("Succes", {
        description: "Réinitialisation réussie",
      });
      router.push(`/`);
    },
    onError: () => {
      toast("Echec", {
        description: "Echec de la réinitialisation du mot de passe",
      });
    },
  });

  const newPasswordSchema = z
    .object({
      password: z.string().min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      }),
      confirmPassword: z.string().min(1, {
        message: "Confirmation du mot de passe requise",
      }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "les deux champs doivent être identiques",
          path: ["confirm"],
        });
      }
    });

  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(newPasswordSchema),
  });

  async function onSubmitResetPassword(
    values: z.infer<typeof newPasswordSchema>
  ) {
    const { password, confirmPassword } = values;
    mutationResetPassword.mutate({
      email,
      code: [...code].join(""),
      password,
      confirmPassword,
    });
  }

  return (
    <div className={cn("space-y-6 transition-all")}>
      <p>Créer un nouveau mot de passe</p>
      <Form {...newPasswordForm}>
        <form
          onSubmit={newPasswordForm.handleSubmit(onSubmitResetPassword)}
          className="space-y-6"
        >
          <FormField
            control={newPasswordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="px-5"
                    placeholder={"votre mot de passe"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newPasswordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 px-5"
                    placeholder={"confirmez votre mot de passe"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={mutationResetPassword.isPending}>
            Valider
          </Button>
          <Button
            variant={"link"}
            className={
              mutationResetPassword.isSuccess ? "block w-full" : "hidden"
            }
            onClick={() => router.push(`/${params.locale}/`)}
          >
            Retour a la connexion
          </Button>
          <BadgeCheck
            fill="#043D4D"
            size={100}
            className="bg-white text-white w-full text-center"
          />
        </form>
      </Form>
    </div>
  );
}

export default ChangePassword;
