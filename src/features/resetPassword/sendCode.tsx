import { verifyOtp } from "@/api/user/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";

function SendCode({
  email,
  handleSucces,
  handleResendEmail,
  code,
  setCode,
}: {
  email: string;
  handleSucces?: () => void;
  handleResendEmail: () => void;
  code: number[];
  setCode: (code: number[]) => void;
}) {
  // const [code, setCode] = useState<number[]>([]);
  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      handleSucces && handleSucces();
    },
  });
  const onChangeCode = (e: number, index: number) => {
    const temp = [...code];
    temp[index] = e;
    setCode([...temp]);
  };

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.slice(-1); //Take only the last character
    e.target.value = value; // Prevent adding multiple characters

    onChangeCode(parseInt(value || "0"), index);

    // Go to next field if completed
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Return to previous field in case of Backspace and empty field
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitCode = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate({
      email,
      code: [...code].join(""),
    });
  };

  return (
    <form onSubmit={onSubmitCode} className={cn("space-y-6 transition-all")}>
      <p>Email envoyé</p>
      <div className="w-full flex justify-center items-center gap-2">
        {[...Array(5)].map((_, index) => (
          <Input
            className="w-12 font-bold"
            key={index}
            maxLength={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={(el: any) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      {mutation.isError ? (
        <p className="text-sm text-center text-destructive">
          Code invalide ou expiré.
        </p>
      ) : (
        <></>
      )}
      <Button
        className="w-full"
        disabled={code.length < 5 || mutation.isPending}
      >
        Vérifier le code
      </Button>
      <p>
        email non reçu ?
        <Button
          type="button"
          asChild
          variant={"link"}
          onClick={handleResendEmail}
        >
          <span>renvoyer le code</span>
        </Button>
      </p>
    </form>
  );
}

export default SendCode;
