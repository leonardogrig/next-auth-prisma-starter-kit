"use client";

import aplyToast from "@/components/ui/aply-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";

interface SettingsPageProps {
  user: User;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const session = useSession();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name || "" },
  });

  async function onSubmit(data: UpdateProfileValues) {
    try {
      await updateProfile(data);
      aplyToast("Profile updated.");
      session.update();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      aplyToast("An error occurred. Please try again.");
    }
  }

  return (
    <main className="px-3 py-10">
      <div className="mx-3 my-10 flex flex-col items-center gap-3">
        {user.image && (
          <Image
            src={user.image}
            width={100}
            alt="User profile picture"
            height={100}
            className="rounded-full"
          />
        )}
        <h1 className="text-center text-xl font-bold">
          {user?.name || `User id should go here`}
        </h1>
        <p className="text-muted-foreground">
          User since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <section className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm space-y-2.5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a username" {...field} />
                  </FormControl>
                  <FormDescription>Your public username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
