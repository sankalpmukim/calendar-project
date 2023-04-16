/* eslint-disable @typescript-eslint/no-misused-promises */
import SignupLayout from "~/components/signup/Layout";
import TextInput from "~/components/inputs/TextInput";
import React, { useState } from "react";
import { api } from "~/utils/api";
import useNotify from "~/components/notifications/useNotify";
import TextArea from "~/components/inputs/TextArea";
import ImageInput from "~/components/inputs/ImageInput";

interface ProfileForm {
  name: string;
  bio: string;
  image: boolean;
  userId: string;
}

interface Props {
  callNextPage: () => void;
  userId: string;
}

export default function Profile({ callNextPage, userId }: Props) {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    bio: "",
    image: false,
    userId,
  });
  const mutation = api.user.signup.createProfile.useMutation();
  const notify = useNotify();

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SignupLayout
        title="Profile"
        shortDescription="Setup your public profile!"
        // eslint-disable-next-line @typescript-eslint/require-await
        onSubmit={async (e) => {
          try {
            e.preventDefault();
            const imageUploadedSuccessfully = await uploadPhoto(userId);
            await mutation.mutateAsync({
              ...form,
              image: imageUploadedSuccessfully,
            });
            callNextPage();
          } catch (error) {
            console.error(error);
            notify({
              title: "Profile",
              message: "Profile generation failed!",
              type: "error",
              show: true,
            });
          }
        }}
        submitDisabled={mutation.isLoading}
      >
        {/* Name input */}
        <TextInput
          label="Name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          id={"name"}
        />
        {/* Bio text area */}
        <TextArea
          label="Bio"
          name="bio"
          placeholder="Tell us about yourself!"
          value={form.bio}
          onChange={handleChange}
          id={"bio"}
        />
        {/* Image input */}
        <ImageInput label="Profile Picture" name="image" id={"file"} />
      </SignupLayout>
    </>
  );
}

const uploadPhoto = async (userId: string) => {
  const inputElement = document.getElementById("file") as HTMLInputElement;
  const file = inputElement.files?.[0];
  if (!file) {
    console.log(`no file selected`);
    return false;
  }

  const filename = encodeURIComponent(`${userId}.png`);
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(
    `/api/upload/image?file=${filename}&fileType=${fileType}`
  );

  const { url, fields } = (await res.json()) as {
    url: string;
    fields: Record<string, string>;
  };
  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: "POST",

    body: formData,
  });

  if (upload.ok) {
    console.log("Uploaded successfully!");
    return true;
  } else {
    console.error("Upload failed.");
    return false;
  }
};
