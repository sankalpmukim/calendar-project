/* eslint-disable @typescript-eslint/no-misused-promises */
import SignupLayout from "~/components/signup/Layout";
import TextInput from "../inputs/TextInput";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import useNotify from "../notifications/useNotify";

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  callNextPage: (userId: string) => void;
}

export default function Registration({ callNextPage }: Props) {
  const [form, setForm] = useState<RegistrationForm>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const mutation = api.user.signup.registerUser.useMutation();
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const notify = useNotify();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (mutation.error) {
      console.log(mutation.error);
      if (mutation.error.message.includes("email")) {
        if (mutation.error.message.includes("unique")) {
          setEmailError("Email already exists");
        } else {
          setEmailError("Invalid email");
        }
      } else if (mutation.error.message.includes("username")) {
        if (mutation.error.message.includes("unique")) {
          setUsernameError("Username already exists");
        } else {
          setUsernameError(
            "Invalid username. It should be between 3 and 20 characters"
          );
        }
      }
    }
  }, [mutation.error]);

  useEffect(() => {
    if (mutation.isSuccess) {
      setForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [mutation.isSuccess]);

  useEffect(() => {
    setEmailError("");
  }, [form.email]);

  useEffect(() => {
    setUsernameError("");
  }, [form.username]);
  return (
    <>
      <SignupLayout
        title="Registration"
        shortDescription="Register a new account!"
        onSubmit={async (e) => {
          try {
            e.preventDefault();
            if (form.password !== form.confirmPassword) {
              notify({
                title: "Registration",
                message: "Passwords do not match!",
                type: "error",
                show: true,
              });
              return;
            }
            const user = await mutation.mutateAsync(form);
            notify({
              title: "Registration",
              message:
                "Registration successful! Check your email for confirmation.",
              type: "warning",
              show: true,
            });
            callNextPage(user?.id ?? "");
          } catch (error) {
            notify({
              title: "Registration",
              message: "Registration failed!",
              type: "error",
              show: true,
            });
          }
        }}
        submitDisabled={
          mutation.isLoading ||
          emailError.length > 0 ||
          usernameError.length > 0
        }
      >
        {/* email */}
        <TextInput
          id={"email"}
          label={"Email"}
          leadingIcon={
            <EnvelopeIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          }
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={emailError}
        />
        {/* unique username */}
        <TextInput
          id={"username"}
          label={"Username"}
          placeholder="username"
          value={form.username}
          onChange={handleChange}
          error={usernameError}
        />
        {/* password */}
        <TextInput
          id={"password"}
          label={"Password"}
          placeholder="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {/* confirm password */}
        <TextInput
          id={"confirmPassword"}
          label={"Confirm Password"}
          placeholder="Reenter password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </SignupLayout>
    </>
  );
}
