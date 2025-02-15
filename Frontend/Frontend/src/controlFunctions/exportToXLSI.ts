import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

type urlType = {
  id: string;
  uid: string;
  pageId: string;
  description: string | null;
  userId: string | null;
  url: string;
  visitorCount: number;
  lastVisit: Date;
};
type PageurlType = {
  description: string;
  visitorCount: number;
  pageUID: string;
  id: string;
  password: string;
  userId: string;
};

export const exportToExcel = async (
  tableData: urlType[],
  password: string,
  pageUID: string
) => {
    console.log(password)
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(pageUID);

  worksheet.addRow(["Description","Link","Encapsulated Link"]);

  tableData.forEach((row) => {
    const values=Object.values(row);
    const description=values[3];
    const link= `${import.meta.env.VITE_BACKEND_API}/${values[1]}`
    const encapsulatedLink=values[5] as string;
    const newRow = worksheet.addRow([description, link, encapsulatedLink]);

    newRow.getCell(2).value = { text: link, hyperlink: link };
    newRow.getCell(2).font = { color: { argb: "0563C1" }, underline: true };
    newRow.getCell(3).value = { text: encapsulatedLink, hyperlink: encapsulatedLink };
    newRow.getCell(3).font = { color: { argb: "0563C1" }, underline: true };
});

  if (password !== "") {
    

    await worksheet.protect(password, {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: true, 
        formatColumns: true, 
        formatRows: true, 
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};

export const exportToExcelPage = async (
  tableData: PageurlType[],
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Pages");

  worksheet.addRow(["Description","Link"]);

  tableData.forEach((row) => {
    const values=Object.values(row);
    console.log(values);
    const description=values[1];
    const link= `${import.meta.env.VITE_FRONTEND_API}/pg/${values[2]}`
    const newRow = worksheet.addRow([description, link]);

    newRow.getCell(2).value = { text: link, hyperlink: link };
    newRow.getCell(2).font = { color: { argb: "0563C1" }, underline: true };
});

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};
