import AvatarPicture from "@/Components/AvatarPicture";
import InputError from "@/Components/InputError";
import { useForm, usePage } from "@inertiajs/react";
import { flushSync } from "react-dom";

export default function UploadImagePictureForm() {
  const { data, setData, errors, post } = useForm<{ image?: File }>({
    image: undefined,
  });
  const { user } = usePage().props.auth;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!data.image) {
      return;
    }

    post(route("profile.upload_profile_picture"), {
      onFinish: () => {
        console.log(true);
      },
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="image"
        className="block size-16 cursor-pointer overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800"
      >
        {user.image && <AvatarPicture image={user.image} />}
      </label>
      <input
        type="file"
        name="image"
        id="image"
        hidden
        onChange={(e) => {
          flushSync(() => {
            if (e.target.files) {
              setData("image", e.target.files[0]);
            }
          });

          e.target.form?.requestSubmit();
        }}
      />
      <InputError message={errors.image} />
    </form>
  );
}
