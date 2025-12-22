import { forgotPassword } from "@/api/user/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { UseFormReturn } from "react-hook-form";

function SendEmail({
  form,
  handleSucces,
}: {
  form: UseFormReturn<{ email: string }>;
  handleSucces?: () => void;
}) {
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      handleSucces && handleSucces();
    },
  });

  const onSubmitEmail = (values: { email: string }, event: React.FormEvent) => {
    event?.preventDefault();
    mutation.mutate(values.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) =>
          form.handleSubmit((values) => onSubmitEmail(values, e))(e)
        }
        className="space-y-6"
      >
        <p>Addresse e-mail</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input required placeholder="Votre adresse e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mutation.isError ? (
          <p className="text-sm text-center text-destructive">
            verifier votre email ou veuillez attendre 1 minute avant de
            réessayer.
          </p>
        ) : (
          <></>
        )}
        <Button
          className="w-full"
          disabled={form.formState.isSubmitting || mutation.isPending}
        >
          Réinitialiser le mot de passe
        </Button>
      </form>
    </Form>
  );
}

export default SendEmail;
