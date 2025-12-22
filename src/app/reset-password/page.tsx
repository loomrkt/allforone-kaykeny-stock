"use client";
import { forgotPassword } from "@/api/user/auth";
import ChangePassword from "@/features/resetPassword/changePassword";
import SendCode from "@/features/resetPassword/sendCode";
import SendEmail from "@/features/resetPassword/sendEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function ResetPassword() {
  const [showStep, setShowStep] = useState<{
    typeCode: boolean;
    changePassword: boolean;
  }>({ typeCode: false, changePassword: false });

  // email form
  const mutationEmail = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setShowStep({ ...showStep, typeCode: true });
    },
  });
  const emailSchema = z.object({
    email: z.string().email({ message: "email invalide" }),
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const onSubmitEmail = (values: z.infer<typeof emailSchema>) => {
    mutationEmail.mutate(values.email);
  };

  // code
  const [code, setCode] = useState<number[]>([]);

  return (
    <div className="container my-24 mx-auto flex flex-col items-center justify-center gap-9 py-10 max-sm:pb-0">
      <h1 className="text-4xl font-bold text-title">Mot de passe oublié ?</h1>
      <div className="bg-white rounded-lg p-4 max-sm:p-0 shadow-md shadow-neutral-200 w-1/2 max-sm:w-full space-y-9 px-24 max-sm:px-4">
        <SendEmail
          form={emailForm}
          handleSucces={() => {
            setShowStep({ ...showStep, typeCode: true });
          }}
        />
        {showStep.typeCode ? (
          <SendCode
            {...{ code, setCode }}
            email={emailForm.getValues("email")}
            handleSucces={() => {
              setShowStep({ ...showStep, changePassword: true });
            }}
            handleResendEmail={() =>
              emailForm.handleSubmit((values) => onSubmitEmail(values))
            }
          />
        ) : (
          <></>
        )}
        {showStep.changePassword ? (
          <ChangePassword email={emailForm.getValues("email")} code={code} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
