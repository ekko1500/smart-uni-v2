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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bcrypt from "bcryptjs";
import { addUser } from "@/functions/functions";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.enum(["student", "teacher", "employee"], {
    errorMap: () => ({ message: "Select a valid role." }),
  }),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "student", // default role
    },
  });

  // Function to hash password using bcryptjs
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
    const hashedPassword = await hashPassword(values.password);
    if (hashedPassword) {
      // Replace plaintext password with hashed password
      values.password = hashedPassword;
      console.log("Submitting:", values);

      // Here you can save `values` to Firebase Firestore
      // Example: Save to Firestore using Firebase SDK
      // firestore.collection('users').add(values);

      //add user
      addUser(values);
    }
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormDescription>Enter a strong password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="">
                      <SelectValue placeholder="student" />
                    </SelectTrigger>
                    <SelectContent {...field}>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Select your role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className=" w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
