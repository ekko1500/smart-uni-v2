"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import bcrypt from "bcryptjs";
import { loginUser } from "@/functions/auth/login";
// Update this import according to your file structure

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function hashPassword(password: string): Promise<string | null> {
    try {
      const saltRounds = 10; // Number of salt rounds to generate the salt
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      return null;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values);

    // Here you can authenticate the user with Firebase or your backend
    // Example: Authenticate with Firebase Auth using Firebase SDK
    // firebase.auth().signInWithEmailAndPassword(values.email, values.password);

    // Custom login function
    loginUser(values);
  }

  return (
    <div className="w-1/3 h-full mx-auto">
      <div className=" flex items-center justify-center flex-col m-[2rem] ">
        <img
          src="../../assets/profile-user.png"
          alt="Profile"
          className=" h-[12rem] w-[12rem]"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormDescription>Enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className=" w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
