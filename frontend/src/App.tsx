"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost/school_attendance/koneksi.php"; // Replace with your backend URL

interface AttendanceRecord {
	id: string;
	student_name: string;
	status: "Present" | "Absent" | "Late";
	date: Date;
}

type AttendanceFormData = Omit<AttendanceRecord, "id"> & { id?: string };

export default function StudentAttendanceCRUD() {
	const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
	const [formData, setFormData] = useState<AttendanceFormData>({
		student_name: "",
		status: "Present",
		date: new Date(),
	});
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	useEffect(() => {
		fetchAttendanceData();
	}, []);

	const fetchAttendanceData = async () => {
		try {
			const response = await axios.get<{ data: AttendanceRecord[] }>(API_URL);
			const formattedData = response.data.data.map((record) => ({
				...record,
				date: parseISO(record.date.toString()),
			}));
			setAttendanceData(formattedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleCreateOrUpdate = async (data: AttendanceFormData) => {
		try {
			const formattedData = {
				...data,
				date: format(data.date, "yyyy-MM-dd"),
			};
			if (isEditing) {
				await axios.put(API_URL, formattedData);
			} else {
				await axios.post(API_URL, formattedData);
			}
			fetchAttendanceData();
			setFormData({ student_name: "", status: "Present", date: new Date() });
			setIsEditing(false);
		} catch (error) {
			console.error("Error saving data:", error);
		}
	};

	const handleEdit = (record: AttendanceRecord) => {
		setFormData(record);
		setIsEditing(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await axios.delete(API_URL, { data: { id } });
			fetchAttendanceData();
		} catch (error) {
			console.error("Error deleting data:", error);
		}
	};

	const handleChange = (name: keyof AttendanceFormData, value: string | Date) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleCreateOrUpdate(formData);
	};

	const columns: ColumnDef<AttendanceRecord>[] = [
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => <div>{row.getValue("id")}</div>,
		},
		{
			accessorKey: "student_name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Student Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div>{row.getValue("student_name")}</div>,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => <div>{row.getValue("status")}</div>,
		},
		{
			accessorKey: "date",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Date
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div>{format(row.getValue("date"), "dd MMMM yyyy")}</div>,
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const record = row.original;
				return (
					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleEdit(record)}
							className="hover:bg-blue-100 hover:text-blue-600 transition-colors">
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleDelete(record.id)}
							className="hover:bg-red-100 hover:text-red-600 transition-colors">
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: attendanceData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="container mx-auto px-4 py-8 min-h-screen">
			<h1 className="text-3xl font-bold mb-8 text-center">Student Attendance CRUD</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Attendance Records</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center py-4">
							<Input
								placeholder="Filter student names..."
								value={(table.getColumn("student_name")?.getFilterValue() as string) ?? ""}
								onChange={(event) =>
									table.getColumn("student_name")?.setFilterValue(event.target.value)
								}
								className="max-w-sm"
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="ml-auto">
										Columns <ChevronDown className="ml-2 h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{table
										.getAllColumns()
										.filter((column) => column.getCanHide())
										.map((column) => {
											return (
												<DropdownMenuCheckboxItem
													key={column.id}
													className="capitalize"
													checked={column.getIsVisible()}
													onCheckedChange={(value) => column.toggleVisibility(!!value)}>
													{column.id}
												</DropdownMenuCheckboxItem>
											);
										})}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead key={header.id}>
														{header.isPlaceholder
															? null
															: flexRender(header.column.columnDef.header, header.getContext())}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row) => (
											<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={columns.length} className="h-24 text-center">
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<div className="flex items-center justify-end space-x-2 py-4">
							<div className="flex-1 text-sm text-muted-foreground">
								{table.getFilteredSelectedRowModel().rows.length} of{" "}
								{table.getFilteredRowModel().rows.length} row(s) selected.
							</div>
							<div className="space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{isEditing ? "Edit Attendance" : "Add Attendance"}</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="student_name">Student Name</Label>
								<Input
									id="student_name"
									name="student_name"
									placeholder="Student Name"
									value={formData.student_name}
									onChange={(e) => handleChange("student_name", e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(value: AttendanceRecord["status"]) =>
										handleChange("status", value)
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Present">Present</SelectItem>
										<SelectItem value="Absent">Absent</SelectItem>
										<SelectItem value="Late">Late</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal",
												!formData.date && "text-muted-foreground"
											)}>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{formData.date ? (
												format(formData.date, "dd MMMM yyyy")
											) : (
												<span>Pick a date</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={formData.date}
											onSelect={(date) => handleChange("date", date || new Date())}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<Button type="submit" className="w-full">
								{isEditing ? "Update" : "Submit"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
