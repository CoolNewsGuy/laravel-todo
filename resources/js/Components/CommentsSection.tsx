import { cn } from "@/lib/utils";
import { Heart, Plus } from "lucide-react";
import TextInput from "./TextInput";
import PrimaryButton from "./PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputError from "./InputError";
import { useNotification } from "@/hooks/use-notification";
import { useContext, useEffect } from "react";
import { ColorContext } from "./ColorCard";

export default function CommentsSection() {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-b-md border py-3 dark:border-gray-700 dark:bg-gray-800">
      {/* <Comment
        commentContent={
          "This is an amazing color. You are truly a colors genius! Looking forward for more colors in the future!"
        }
      />
      <CommentsDivider className="w-full border-gray-300 dark:border-gray-700" />
      <Comment commentContent="This is so good" />
      <CommentsDivider className="w-full border-gray-300 dark:border-gray-700" />
      <Comment commentContent="Keep it up! I love your colors. They're so good" /> */}
      <NewCommentForm />
    </div>
  );
}

function Comment({ commentContent }: { commentContent: React.ReactNode }) {
  return (
    <div className="w-[90%]">
      <div className="flex gap-2">
        <CommentUser userName="Aymen Bahmed" createdAt={new Date()} />
      </div>

      <CommentContent className="mt-4 p-1">{commentContent}</CommentContent>

      <div className="mt-1">
        <CommentLikeButton likes={20} />
      </div>
    </div>
  );
}

function CommentsDivider({ className }: { className?: string }) {
  return (
    <hr className={cn("border-gray-300 dark:border-gray-700", className)} />
  );
}

function CommentUser({
  userName,
  createdAt,
}: {
  userName: string;
  createdAt: Date;
}) {
  return (
    <>
      <div className="size-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800"></div>

      <div className="flex flex-col justify-around">
        <h2 className="text-sm">{userName}</h2>
        <p className="text-xs text-muted-foreground">
          {createdAt.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
    </>
  );
}

function CommentContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

function CommentLikeButton({
  likes,
  className,
}: {
  likes: number;
  className?: string;
}) {
  return (
    <button
      aria-label="like comment"
      className={cn(
        "flex items-center text-muted-foreground transition-colors hover:text-red-500",
        className,
      )}
    >
      <div className="grid size-8 place-content-center rounded-full group-hover:bg-red-600/20">
        <Heart size={20} />
      </div>

      <p>{likes}</p>
    </button>
  );
}

function NewCommentForm() {
  const { data, setData, errors, setError, post, reset, get } = useForm({
    content: "",
  });
  const notification = useNotification();
  const color = useContext(ColorContext);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (data.content === "") {
      setError("content", "required!");

      return;
    }

    post(route(`color.comments`, color?.id), {
      preserveScroll: true,

      onSuccess: () => {
        notification.show({
          message: "Added comment successfully!",
          state: "success",
        });
      },

      onError: () => {
        notification.show({
          message: "Couldn't add comment! Please try again.",
          state: "error",
        });
      },
    });
  }

  return (
    <form className="w-[90%]" onSubmit={onSubmit}>
      <div className="flex">
        <TextInput
          className="w-[100%] rounded-r-none"
          placeholder="Type your comment..."
          onChange={(e) => {
            setError("content", "");
            setData("content", e.currentTarget.value);
          }}
          value={data.content}
        />
        <PrimaryButton
          className="rounded-l-none dark:bg-indigo-800 dark:text-white dark:hover:!bg-indigo-900 dark:focus:!bg-indigo-900 dark:active:bg-indigo-900"
          aria-label="Add comment"
        >
          <Plus />
        </PrimaryButton>
      </div>

      <InputError className="font-bold" message={errors.content} />
    </form>
  );
}
