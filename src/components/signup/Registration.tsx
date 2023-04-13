import Layout from "~/components/signup/Layout";
import TextInput from "../inputs/TextInput";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { api } from "~/utils/api";
import useNotify from "../notifications/useNotify";

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Registration() {
  const [form, setForm] = useState<RegistrationForm>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const mutation = api.user.signup.registerUser.useMutation();
  const notify = useNotify();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Layout
        title="Registration"
        shortDescription="Register a new account!"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
          notify({
            title: "Registration",
            message: "Registration successful!",
            type: "warning",
            show: true,
          });
        }}
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
        />
        {/* unique username */}
        <TextInput
          id={"username"}
          label={"Username"}
          placeholder="username"
          value={form.username}
          onChange={handleChange}
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
      </Layout>
    </>
  );
}
