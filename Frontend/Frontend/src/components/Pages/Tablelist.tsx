import React, { useEffect, useMemo, useState } from "react";
import { Ellipsis, Link } from "lucide-react";
import { motion } from "framer-motion";

import {
  ColumnDef,
  getCoreRowModel,
  flexRender,
  useReactTable,
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

type urlType = {
  Description: string;
  VisitorCount: number;
  Link: string;
};

const Tablelist = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);
  const [data, setData] = useState<urlType[]>([]);
  const [title, setTitle] = useState<string>("");

  console.log("ohh yeah re");

  const columns: ColumnDef<urlType>[] = [
    {
      accessorKey: "Description",
      header: "Description",
      cell: ({ row }) => {
        return <span className="truncate">{row.getValue("Description")}</span>;
      },
    },
    {
      accessorKey: "Link",
      header: "Link",
      cell: ({ row }) => {
        return (
          <div className="w-full flex justify-center">
            <a href={row.getValue("Link")} target="_blank">
              <Link className="w-4  h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 hover:brightness-200" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "VisitorCount",
      header: "Visitor Count",
      cell: ({ row }) => {
        return (
          <span className="w-full flex justify-center">
            {row.getValue("VisitorCount")}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: () => {
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
                      setCustomComponent(<PasswordDialog />);
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
                      setCustomComponent(<EditDialog />);
                      setTitle("Edit Description");
                    }
                  }}
                  className="text-xs md:text-sm"
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem className="text-xs md:text-sm">Share</DropdownMenuItem>

                <DropdownMenuItem className="text-xs md:text-sm">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setData([
      {
        Description:
          "JavaSfasefasefasfasfasfasefasefasefasefasefasefasefcript basfsfasfasfasfsfasfsadfasfsfasfasfasfasfasfasfasfasfasfsics and advanced concepts ans what do you want",
        Link: "https://google.com",
        VisitorCount: 5,
      },
      {
        Description: "Introduction to React and component-based architecture",
        Link: "https://example.com/react-course",
        VisitorCount: 12,
      },
      {
        Description: "Learn Flexbox, Grid, and animations in CSS",
        Link: "https://example.com/css-course",
        VisitorCount: 8,
      },
      {
        Description: "Guide to backend development with Node.js",
        Link: "https://example.com/nodejs-course",
        VisitorCount: 20,
      },
      {
        Description: "Data science fundamentals with Python",
        Link: "https://example.com/python-data-science",
        VisitorCount: 15,
      },
      {
        Description: "SQL, NoSQL, and data management techniques",
        Link: "https://example.com/db-management",
        VisitorCount: 9,
      },
      {
        Description: "Full-stack development with hands-on projects",
        Link: "https://example.com/web-dev-bootcamp",
        VisitorCount: 30,
      },
      {
        Description: "Basics of ML and common algorithms",
        Link: "https://example.com/ml-course",
        VisitorCount: 14,
      },
      {
        Description: "Git fundamentals and workflow",
        Link: "https://example.com/git-course",
        VisitorCount: 7,
      },
      {
        Description: "Agile, Scrum, and project management tools",
        Link: "https://example.com/project-management",
        VisitorCount: 22,
      },
    ]);
  }, []);

  const table = useReactTable<urlType>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const Tables = useMemo(() => {
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    );
  }, [data]);

  console.log(openDialog);
  console.log(customComponent);
  console.log(data);

  return (
    <>
      <div className="mx-4 sm:mx-8 shadow-2xl mt-12 md:mt-24">
        {Tables}
        <DialogWindow
          isOpen={openDialog}
          setIsOpen={setOpenDialog}
          dialogTitle={title}
        >
          {customComponent}
        </DialogWindow>
      </div>
    </>
  );
};

export default Tablelist;
