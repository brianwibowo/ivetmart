"use client";

import { useState } from "react";
import { toast } from "sonner";
import { registerSellerStoreAction } from "@/app/seller/actions";

export function SellerRegisterForm({ children }: { children: React.ReactNode }) {
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPending(true);
		const formData = new FormData(e.currentTarget);
		try {
			toast.success("Permohonan pendaftaran toko berhasil dikirim!");
			await registerSellerStoreAction(formData);
		} catch (err: any) {
			toast.error(err?.message || "Gagal mendaftarkan toko.");
			setPending(false);
		}
	};

	return <form onSubmit={handleSubmit}>{children}</form>;
}
