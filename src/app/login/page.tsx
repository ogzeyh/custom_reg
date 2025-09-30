"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";

export default function Register() {
    const LoginSchema = z.object({
    email: z.string().email("Niepoprawny email"),
    password: z.string().min(1, "Hasło jest wymagane")
    });

    type LoginFormData = z.infer<typeof LoginSchema>

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(LoginSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (data: LoginFormData) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        })

        const json = await response.json();


        if (!response.ok) {
            setError("email", { type: "manual", message: json.error });
            setError("password", { type: "manual", message: json.error });
            return;
        }
        
        redirect('/dashboard');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Stwórz konto
                </h1>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                            Adres e-mail
                        </label>
                        <input
                            {...register('email')}
                            id="email"
                            name="email"
                            type="email"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
                            Hasło
                        </label>
                        <input
                            {...register('password')}
                            id="password"
                            name="password"
                            type="password"
                        />
                    </div>

                    {(errors.email || errors.password) && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.email?.message || errors.password?.message}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
                        >
                            Zarejestruj się
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}