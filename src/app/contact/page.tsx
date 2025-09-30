"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

export default function Contact() {
    const ContactSchema = z.object({
        name: z.string().min(1, "Imię jest wymagane"),
        email: z.string().email("Nieprawidłowy email"),
        message: z.string().min(1, "Wiadomość nie może być pusta")
    })

    type ContactFormData = z.infer<typeof ContactSchema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(ContactSchema)
    })

    const onSubmit = async (data: ContactFormData) => {        
        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        });

            const json = await response.json();
            
            if(!response.ok) {
                console.error('Problem z wysyłką')
            } else {
                console.log("Wysłano!")
            }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                Name: <input {...register("name")} name="name" type="text" />
                {errors.name && <p>{errors.name.message}</p>}
                Email: <input {...register("email")} name="email" type="email" />
                {errors.email && <p>{errors.email.message}</p>}
                Message: <input {...register("message")} name="message" type="text" />
                {errors.message && <p>{errors.message.message}</p>}

                <button disabled={isSubmitting}>Submit</button>
            </form>
        </div>
    )
}