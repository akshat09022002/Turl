import React, { useEffect, useState } from "react";
import {
  ArrowUp01,
  ArrowUp10,
  ArrowUpAZ,
  ArrowUpDown,
  ArrowUpZA,
  Copy,
  Ellipsis,
  FileDown,
  Link,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import XLogo from "../../assets/twitter.png";
import LinkedInLogo from "../../assets/linkedin.png";
import {
  ColumnDef,
  getCoreRowModel,
  flexRender,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DialogWindow from "./DialogWindow";
import PasswordDialog from "./PasswordDialog";
import EditDialog from "./EditDialog";
import axios from "axios";
import { useRecoilState } from "recoil";
import { rerender } from "@/store/atoms/atom";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CustomTooltip from "../common/CustomTooltip";
import { Spinner } from "../ui/spinner";
import { exportToExcelPage } from "@/controlFunctions/exportToXLSI";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Skeleton } from "../ui/skeleton";

type urlType = {
  description: string;
  visitorCount: number;
  pageUID: string;
  id: string;
  password: string;
  userId: string;
};

type urlResponse = {
  msg: string;
  Data: urlType[];
};

const Tablelist = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);
  const [data, setData] = useState<urlType[]>([]);
  const [title, setTitle] = useState<string>("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [rerenderValue, setrerenderValue] = useRecoilState(rerender);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [descriptionSortingLogo, setDescriptionSortingLogo] =
    useState<React.ReactNode>(
      <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
    );
  const [visitorSortingLogo, setVisitorSortingLogo] = useState<React.ReactNode>(
    <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
  );
  const [pageLoader, setPageLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleDelete = async (pageUID: string) => {
    try {
      await axios
        .delete<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/pages/deleteUrl/${pageUID}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          setrerenderValue((e) => e + 1);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    }
  };

  const columns: ColumnDef<urlType>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <div
            onClick={() => {
              const isSorted = column.getIsSorted();
              setVisitorSortingLogo(
                <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
              );
              if (isSorted === "desc") {
                column.toggleSorting(false); // Set to "desc" first
                setDescriptionSortingLogo(
                  <ArrowUpAZ className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              } else if (isSorted === "asc") {
                column.clearSorting(); // Remove sorting (unsorted)
                setDescriptionSortingLogo(
                  <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              } else {
                column.toggleSorting(true); // Switch to "asc"
                setDescriptionSortingLogo(
                  <ArrowUpZA className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              }
            }}
            className="flex flex-col pl-4 items-center hover:cursor-pointer sm:flex-row sm:pl-0"
          >
            Description
            {descriptionSortingLogo}
          </div>
        );
      },
      cell: ({ row }) => {
        return <span className="truncate">{row.getValue("description")}</span>;
      },
    },
    {
      accessorKey: "pageUID",
      header: "Link",
      cell: ({ row }) => {
        return (
          <div className="w-full flex justify-center">
            <a href={`/pg/${row.getValue("pageUID")}`} target="_blank">
              <Link className="w-4  h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 hover:brightness-200" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "visitorCount",
      header: ({ column }) => {
        return (
          <div
            onClick={() => {
              const isSorted = column.getIsSorted();
              setDescriptionSortingLogo(
                <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
              );
              if (isSorted === "desc") {
                column.toggleSorting(false); // Set to "desc" first
                setVisitorSortingLogo(
                  <ArrowUp01 className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              } else if (isSorted === "asc") {
                column.clearSorting(); // Remove sorting (unsorted)
                setVisitorSortingLogo(
                  <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              } else {
                column.toggleSorting(true); // Switch to "asc"
                setVisitorSortingLogo(
                  <ArrowUp10 className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
                );
              }
            }}
            className="flex flex-col justify-center items-center hover:cursor-pointer sm:flex-row"
          >
            VisitorCount
            {visitorSortingLogo}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="w-full flex justify-center">
            {row.getValue("visitorCount")}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;
        const rowId = rowData.id;
        const rowUID = rowData.pageUID;
        const encodedURL = encodeURIComponent(
          `${import.meta.env.VITE_FRONTEND_API}/pg/${rowData.pageUID}`
        );
        const shareText =
          "This URL was generated using Turl, the ultimate URL shortener. Check it out!";
        const socialLinks = {
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
          twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedURL}`,
        };
        return (
          <div className="w-full flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="outline-none">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4 sm:w-44 md:w-56">
                <DropdownMenuLabel className="text-xs md:text-sm">
                  Password: current password
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    if (!openDialog) {
                      setOpenDialog(true);
                      setCustomComponent(
                        <PasswordDialog
                          rowId={rowId}
                          setOpenDialog={setOpenDialog}
                        />
                      );
                      setTitle("Change Password");
                    }
                  }}
                  className="text-xs md:text-sm"
                >
                  Change Password
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    if (!openDialog) {
                      setOpenDialog(true);
                      setCustomComponent(
                        <EditDialog
                          rowId={rowId}
                          setOpenDialog={setOpenDialog}
                        />
                      );
                      setTitle("Edit Description");
                    }
                  }}
                  className="text-xs md:text-sm"
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs md:text-sm ml-2">
                    Share
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-gray-200 z-50 rounded-md">
                      <DropdownMenuItem>
                        <span>
                          <Copy
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${import.meta.env.VITE_FRONTEND_API}/${
                                  rowData.pageUID
                                }`
                              );
                              toast({
                                title: "Copied to clipboard!",
                              });
                            }}
                            className="w-6 h-6 hover:cursor-pointer hover:scale-90"
                          />
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>
                          <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              className="h-8 w-8 hover:cursor-pointer hover:scale-90"
                              src={XLogo}
                            />
                          </a>
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>
                          <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              className="h-8 w-8 hover:cursor-pointer hover:scale-90"
                              src={LinkedInLogo}
                            />
                          </a>
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem
                  className="text-xs md:text-sm"
                  onClick={() => handleDelete(rowUID)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const getpages = async () => {
    setPageLoader(true);
    try {
      await axios
        .get<urlResponse>(
          `${import.meta.env.VITE_BACKEND_API}/pages/getPages`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setData(response.data.Data);
          setPageLoader(false);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
      setData([]);
      navigate("/");
    }
  };

  useEffect(() => {
    getpages();
  }, [rerenderValue]);

  const table = useReactTable<urlType>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const renderSkeletonRows = () => {
    const skeletonRows = Array(3).fill(null); // 3 skeleton rows
    return skeletonRows.map((_, rowIndex) => (
      <motion.tr
        key={`skeleton-row-${rowIndex}`}
        whileHover={{
          scale: 1.008,
          transition: { duration: 0.2 },
        }}
        className="border-y-[1px] border-white hover:bg-[#3a1d87]"
      >
        {table.getHeaderGroups()[0].headers.map((header) => (
          <TableCell
            key={`skeleton-cell-${header.id}-${rowIndex}`}
            className="py-4 px-4 font-semibold text-xs sm:text-base md:text-lg max-w-4 sm:max-w-8 overflow-y-auto no-scrollbar"
          >
            <Skeleton className="h-6 w-full bg-white/20" />
          </TableCell>
        ))}
      </motion.tr>
    ));
  };

  const Tables = () => {
    return (
      <>
        <Table className="rounded-lg bg-[#cc1b6c]/80 text-white overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="font-extrabold text-white text-center  p-4 max-w-4 sm:max-w-8 text-sm sm:text-lg md:text-xl "
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {pageLoader ? (
            <TableBody>{renderSkeletonRows()}</TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    whileHover={{
                      scale: 1.008,
                      transition: { duration: 0.2 },
                    }}
                    className="border-y-[1px] border-white hover:bg-[#3a1d87]"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="py-4 px-4 font-semibold text-xs sm:text-base md:text-lg max-w-4 sm:max-w-8  overflow-y-auto no-scrollbar"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No page found. Please add a page to view.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </>
    );
  };

  return (
    <>
      <DialogWindow
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        dialogTitle={title}
      >
        {customComponent}
      </DialogWindow>
      <div className="relative flex items-center py-4 mt-12 mx-6 sm:mx-10 md:mt-24">
        <Search className="absolute hover:text-[#3a1d87] hover:brightness-200 h-4 w-4 sm:h-6 sm:w-6 left-1" />
        <Input
          placeholder="Filter descriptions..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="w-3/5 bg-white text-sm max-w-[600px] p-4 px-6 sm:px-8 sm:text-base md:p-6 md:pl-8 md:text-lg"
        />
        {csvLoading ? (
          <CustomTooltip message="Generating Excel...">
            <Spinner className="text-white hover:text-[#3a1d87] hover:brightness-200 hover:scale-125 w-8 h-8 ml-2 sm:w-8 sm:h-8 sm:ml-6 md:w-10 md:h-10" />
          </CustomTooltip>
        ) : (
          <CustomTooltip message="Export to Excel">
            <FileDown
              onClick={async () => {
                if (data.length > 0) {
                  setCsvLoading(true);
                  await exportToExcelPage(data);
                  setCsvLoading(false);
                } else {
                  toast({
                    title: "No data to export",
                    description: "Please add data to export",
                  });
                }
              }}
              className="text-white hover:text-[#3a1d87] hover:brightness-200 hover:scale-125 w-8 h-8 ml-2 sm:w-8 sm:h-8 sm:ml-6 md:w-10 md:h-10"
            />
          </CustomTooltip>
        )}
      </div>
      <div className="mx-4 sm:mx-8 shadow-2xl">
        <Tables />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 mx-6 sm:mx-10 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 w-16 md:h-10 md:w-18 "
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 w-16 md:h-10 md:w-18"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Tablelist;
