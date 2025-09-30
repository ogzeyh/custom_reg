"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
    const RegisterSchema = z.object({
        email: z.email("Email jest niepoprawny"),
        password: z.string()
        .min(5, "Hasło musi zawierać minimum 5 znaków")
        .regex(/\d/, "Hasło musi zawierać co najmniej jedną cyfrę")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Hasło musi zawierać co najmniej jeden znak specjalny")
    }).superRefine(async (data, ctx) => {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(data.email)}`);
        const json = await res.json();

        if (json.exists) {
            ctx.addIssue({
                path: ["email"],
                message: "Ten email jest już zarejestrowany",
                code: "custom"
            })
        }
    })

    type RegisterFormData = z.infer<typeof RegisterSchema>

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(RegisterSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (data: RegisterFormData) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error("Coś poszło nie tak")
        } else {
            console.log('Wysłano!')
        }
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
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
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
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

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