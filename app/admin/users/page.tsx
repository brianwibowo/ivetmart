/**
 * Admin Users Management Page — Ivet Mart
 *
 * User account table with search, role badges, status toggle, and pagination.
 * Uses ActionForm + SubmitButton for toast feedback & double-click prevention.
 */

import { count, desc } from "drizzle-orm";
import { Shield, UserCheck, UserX } from "lucide-react";
import { toggleUserStatusAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function AdminUsersPage(props: { searchParams?: Promise<{ page?: string }> }) {
	await requireAdmin();
	const searchParams = await props.searchParams;
	const currentPage = Number.parseInt(searchParams?.page || "1", 10);
	const pageSize = 10;
	const offset = (currentPage - 1) * pageSize;

	const [totalCountRes] = await db.select({ count: count() }).from(users);
	const totalItems = Number(totalCountRes?.count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const pagedUsers = await db
		.select()
		.from(users)
		.orderBy(desc(users.createdAt))
		.limit(pageSize)
		.offset(offset);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Kelola Pengguna</h1>
				<p className="text-sm text-muted-foreground">
					Daftar seluruh akun pengguna platform Ivet Mart (Pembeli, Penjual & Admin).
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg">Katalog Akun Pengguna</CardTitle>
					<CardDescription>Total {totalItems} pengguna terdaftar di database.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
								<tr>
									<th className="px-4 py-3">Nama & Email</th>
									<th className="px-4 py-3">Telepon</th>
									<th className="px-4 py-3">Peran (Role)</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3">Terdaftar</th>
									<th className="px-4 py-3 text-right">Aksi</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/40">
								{pagedUsers.map((user) => (
									<tr key={user.id} className="hover:bg-muted/20">
										<td className="px-4 py-3 font-medium">
											<div className="flex flex-col">
												<span className="text-foreground">{user.name}</span>
												<span className="text-xs text-muted-foreground font-mono">{user.email}</span>
											</div>
										</td>
										<td className="px-4 py-3 text-xs text-muted-foreground font-mono">{user.phone || "-"}</td>
										<td className="px-4 py-3">
											<RoleBadge role={user.role} />
										</td>
										<td className="px-4 py-3">
											{user.status === "active" ? (
												<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
													Aktif
												</Badge>
											) : (
												<Badge variant="destructive" className="text-xs">
													Suspended
												</Badge>
											)}
										</td>
										<td className="px-4 py-3 text-xs text-muted-foreground">
											{user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "-"}
										</td>
										<td className="px-4 py-3 text-right">
											{user.role !== "admin" && (
												<ActionForm action={toggleUserStatusAction}>
													<input type="hidden" name="userId" value={user.id} />
													<input type="hidden" name="currentStatus" value={user.status} />
													{user.status === "active" ? (
														<SubmitButton
															loadingText="..."
															size="sm"
															variant="ghost"
															className="text-destructive hover:bg-destructive/10 text-xs h-8"
														>
															<UserX className="h-3.5 w-3.5 mr-1" />
															Suspend
														</SubmitButton>
													) : (
														<SubmitButton
															loadingText="..."
															size="sm"
															variant="ghost"
															className="text-emerald-600 hover:bg-emerald-50 text-xs h-8"
														>
															<UserCheck className="h-3.5 w-3.5 mr-1" />
															Aktifkan
														</SubmitButton>
													)}
												</ActionForm>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<DataTablePagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						pageSize={pageSize}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

function RoleBadge({ role }: { role: string }) {
	switch (role) {
		case "admin":
			return (
				<Badge variant="default" className="bg-primary text-xs">
					<Shield className="h-3 w-3 mr-1" /> Admin
				</Badge>
			);
		case "seller":
			return (
				<Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300 text-xs">
					Penjual
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="text-xs">
					Pembeli
				</Badge>
			);
	}
}
